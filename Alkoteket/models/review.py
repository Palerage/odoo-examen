from odoo import api, fields, models, _
from odoo.exceptions import ValidationError

import logging
_logger = logging.getLogger(__name__)

class AlkoteketDrinkReview(models.Model):
    _name = "alkoteket.drink.review"
    _description = "Review"
    
    created_by_id = fields.Many2one('res.users', string='Reviewer')
    score = fields.Integer(string="Score")
    review = fields.Text(string="Review")
    drink_id = fields.Many2one("alkoteket.drink", string="Drink")
    
    @api.constrains('score')
    def _check_score(self):
        for record in self:
            if record.score < 1 or record.score > 5:
                raise ValidationError("The score must be between 1 and 5.")
    
    @api.model
    def create(self, vals):
        _logger.error(f"Vals:-------------------{vals}")
        _logger.error(f"Self:-------------------{self}")
        review = super().create(vals)
        return review
    
    # @api.model
    # def write(self, vals):
    #     _logger.error(f"Vals:-------------------{vals}")
    #     review = super().write(vals)
    #     return review