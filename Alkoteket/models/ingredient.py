from odoo import api, fields, models, _

class AlkoteketIngredient(models.Model):
    _name = "alkoteket.ingredient"
    _description = "Ingredient"
    
    name = fields.Char(string='Name', required=True)

    alcoholcontent = fields.Integer(string='AlcoholContent')
    type = fields.Selection([
        ('alcoholic', 'Alcoholic'),
        ('nonalcoholic', 'Non-Alcoholic'),
        ('invalid', 'Error')
    ], required=True, default='alcoholic')
    
    note = fields.Text(string='Description')
    image = fields.Binary(string='Patient Image')
    
    @api.model
    def create(self, vals):
        if vals.get('alcoholcontent') > 0 and vals.get('alcoholcontent') <= 100:
            vals['type'] = 'alcoholic'
        elif vals.get('alcoholcontent') <= 0:
            vals['type'] = 'nonalcoholic'
                
        res = super(AlkoteketIngredient, self).create(vals)

        return res