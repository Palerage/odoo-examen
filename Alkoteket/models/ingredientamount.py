from odoo import api, fields, models, _

class AlkoteketIngredientAmount(models.Model):
    _name = "alkoteket.ingredient.amount"
    _description = "Ingredient Amount"
    
    ingredient_ids = fields.Many2one('alkoteket.ingredient', string="Ingredients")
    qty = fields.Float(string="Quantity(cl)")
    drink_id = fields.Many2one("alkoteket.drink", string="Drink Name", ondelete='cascade')
