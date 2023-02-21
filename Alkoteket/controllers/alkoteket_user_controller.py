import json
from odoo import http
from odoo.http import request
import logging
import random
import json
from odoo.http import Response
_logger = logging.getLogger(__name__)

class UserController(http.Controller):
    name = "alkoteket.user.api"
    
    @http.route('/users/<int:user_id>', type="json", methods=['POST'], auth='public')
    def user_profile(self, user_id):
        _logger.error("-----------------------------USER--------------------------------------")
        if(user_id == 0):
            # Return the current user's ID if user_id is 0
            user_id = request.env.user.id
            
        user = request.env['res.users'].sudo().browse(user_id)
        if not user.exists():
            return {'error': 'User not found'}
        
        # Only include a limited set of fields in the response
        
        data = {
            'active': user.active,
            'name': user.name,
            'email': user.email,
            'login_date': str(user.login_date),
            'image_1920': str(user.image_1920)[2:-1],
        }
        
        return json.dumps(data)

