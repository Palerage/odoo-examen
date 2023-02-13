from odoo import api, fields, models, _
from odoo.exceptions import ValidationError
# import openai
import base64
import requests
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)

class Users(models.Model):
    
    # _name = "alkoteket.user"
    _inherit = 'res.users'
    
    _description = "Contains relevant information about a specific 'Alkoteket User'"
    
    # user_id = fields.Many2one('res.users', string="Parent", tracking=True)
    
    fav_drinks = fields.Many2many('alkoteket.drink', string="Favourite Drinks", tracking=True)
    

# class AlkoteketUserDrink(models.Model):
#     _name = "alkoteket.user.drink"
#     _description = "Contains the many-to-many relationship between 'AlkoteketUser' and 'alkoteket.drink'"

#     user_id = fields.Many2one('alkoteket.user', string="User", required=True)
#     drink_id = fields.Many2one('alkoteket.drink', string="Drink", required=True)