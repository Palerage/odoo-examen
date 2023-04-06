from odoo import api, fields, models, _
from odoo.exceptions import ValidationError
# import openai
import base64
import requests
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)

class AlkoteketDrink(models.Model):
    _name = "alkoteket.drink"
    _description = "Alkoteket Drink"
                
    name = fields.Char(string='Name') #, required=True
    reference = fields.Char(string='Order Reference', required=True, copy=False, readonly=True, 
                            default=lambda self: _('New'))
    type = fields.Selection([
        ('alcoholic', 'Alcoholic'),
        ('nonalcoholic', 'Non-Alcoholic')
    ],  default='alcoholic', compute='_compute_alcohol_content') #, store=True, compute='_compute_alcohol_content'
    note = fields.Text(string='Instructions')
    ingredient_amount_ids = fields.One2many('alkoteket.ingredient.amount', 'drink_id',
                                            string="Ingredients",
                                            required=True)
    drink_glass = fields.Many2one("alkoteket.container", string="Glass")
    total_alcohol_amount = fields.Float(string="TotalAlcohol(CL)", compute='_compute_total_alcohol_amount', store=True)
    total_volume = fields.Float(string="TotalVolume(CL)", compute='_compute_total_volume', store=True)
    alcohol_percentage = fields.Float(string="DrinkPercentage", compute='_compute_alcohol_percentage', store=True)
    drink_review_ids = fields.One2many("alkoteket.drink.review", 'drink_id', string="Reviews")
    average_score = fields.Float(string="AverageScore", compute='_compute_average_score' )#, store=True
    image = fields.Binary(string='Drink Image')
    
    created_by_id = fields.Many2one('res.users', string="Creator")
    
    @api.depends('ingredient_amount_ids')
    def _compute_alcohol_content(self):
        print("Hej")
        for record in self:
            if record.ingredient_amount_ids.filtered(lambda x: x.ingredient_ids.alcoholcontent > 0):
                record.type = "alcoholic"
            else:
                record.type = "nonalcoholic"
    
    # Generates a prompt based on ingredients
    
    # def fetch_note_from_api(self):
    #     prompt = "Come up with a awesome and creative name, without quotations, for a cocktail containing these ingredients: "
    #     for ingredient in self.ingredient_amount_ids.mapped('ingredient_ids'):
    #         prompt += ingredient.name  + ", "
    #     self.name = api_call(prompt)
    
    @api.depends('drink_review_ids')
    def _compute_average_score(self):
        for record in self:
            numberOfReviews = 0
            totalPoints = 0
            if record.drink_review_ids:
                
                for review in record.drink_review_ids:
                    numberOfReviews += 1
                    totalPoints += review.score
                if numberOfReviews != 0:
                    record.average_score = round(totalPoints / numberOfReviews, 2)
            else:
                record.average_score = 0
        
    @api.depends('ingredient_amount_ids')
    def _compute_total_volume(self):
        for record in self:
            totalVolume = 0
            for ingredient in record.ingredient_amount_ids:
                totalVolume += float(ingredient.qty)
            record.total_volume = totalVolume
        
    @api.depends('ingredient_amount_ids')
    def _compute_total_alcohol_amount(self):
        for record in self:
            totalAlcoholVolume = 0
            for ingredient in record.ingredient_amount_ids:
                ingredientAlcoholContent = ingredient.mapped('ingredient_ids').alcoholcontent
                if ingredientAlcoholContent > 0:
                    totalAlcoholVolume += (ingredientAlcoholContent / 100) * float(ingredient.qty)
            totalAlcoholVolume = round(totalAlcoholVolume, 2)
            record.total_alcohol_amount = totalAlcoholVolume

    @api.depends('total_volume', 'total_alcohol_amount')
    def _compute_alcohol_percentage(self):
        for record in self:
            if record.total_volume > 0:
                record.alcohol_percentage = (record.total_alcohol_amount / record.total_volume) # * 100
            else:
                record.alcohol_percentage = 0
    
    def unlink(self):
        for ingredient in self.ingredient_amount_ids:
            ingredient.unlink()
        for review in self.drink_review_ids:
            review.unlink()
            
        return super(AlkoteketDrink, self).unlink()
    
    # Makes sure that the drink names are Unique
    @api.constrains('name')
    def check_name(self):
        for rec in self:
            drinks = self.env['alkoteket.drink'].search([('name', 'ilike', rec.name), ('id', '!=', rec.id)])
            if drinks:
                raise ValidationError(_("Drink name %s already Exists" % rec.name))

    @api.model
    def create(self, vals):
        if not vals.get('note'):
            vals["note"] = "No description available..."
        # Sets the appropriate type depending on alcoholcontent in the ingredients.
        drink = super().create(vals)
        drink.created_by_id = request.env.user
        ingredients = drink.ingredient_amount_ids.mapped('ingredient_ids')
        has_alcohol = any(ingredient.alcoholcontent > 0 for ingredient in ingredients)
        if has_alcohol:
            drink.type = 'alcoholic'
        else:
            drink.type = 'nonalcoholic'
            
        # Generate description using openai if no description is given
        # _logger.error(f"Starting Description generation")
        # if not vals.get('note'):
        #     prompt = "Come up with a funny description for my cocktail which contains: "
            
        #     for ingredient in ingredients:
        #         prompt += ingredient.name + ", "
                
        #     prompt += ". Don't include a name for the cocktail. Also come up with a childish story about how the cocktail was invented"
        #     # prompt += ". Don't include a name for the cocktail. Also come up with a story told by a drunk and cool teenager about how the cocktail was invented"

        #     drink.note = self.api_call(prompt)
        
        # # If no image is given, generate one with Dall-e
        # _logger.error(f"Starting Image generation")
        # if not vals.get('image'):
        #     image_url = self.generate_image(drink.note)
        #     _logger.error(f"{image_url}")
        #     try:
        #         drink.write({'image': base64.b64encode(requests.get(image_url.strip()).content).replace(b"\n", b"")})
        #     except Exception as e:
        #         raise ValidationError(_(str(e)))
        return drink
    
    # @api.model
    # def api_call(self, prompt):
    #     openai.api_key = ""
    #     model_engine = "text-davinci-003"
    #     try:
    #         completions = openai.Completion.create(
    #             engine=model_engine,
    #             prompt=prompt,
    #             max_tokens=2048,
    #             n=1,
    #             temperature=0.7,
    #         )
    #     except Exception as e:
    #         raise ValidationError(_(str(e)))
    #     message = completions.choices[0].text.replace("\n", "")
        
    #     return message
    
    # @api.model
    # def generate_image(self, prompt):
    #     openai.api_key = ""
    #     try:
    #         response = openai.Image.create(
    #             prompt=prompt,
    #             n=1,
    #             size="256x256",
    #         )
    #     except Exception as e:
    #         raise ValidationError(_(str(e)))
        
    #     image_url = response["data"][0]["url"]
    #     _logger.error(image_url)
    #     return image_url