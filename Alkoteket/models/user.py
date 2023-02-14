from odoo import api, fields, models, _
from odoo.exceptions import ValidationError
# import openai
import base64
import requests
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)

class Users(models.Model):
    _inherit = 'res.users'
    _description = "Contains relevant information about a specific 'Alkoteket User'"
    
    created_drinks = fields.One2many('alkoteket.drink', 'created_by_id', string="Created Drinks", tracking=True)    
    fav_drinks = fields.Many2many('alkoteket.drink', string="Favourite Drinks", tracking=True)
