import json
from odoo import http
from odoo.http import request
import logging
import random
_logger = logging.getLogger(__name__)

class AlkoteketIngredientController(http.Controller):
    _name = "alkoteket.ingredient.api"
    
    # Returns ingredient based on id
    @http.route(['/alkoteket/ingredient/<int:id>'], auth='public', type="http", methods=['GET'] )
    def get_ingredient_by_id(self, id):
        ingredient = request.env['alkoteket.ingredient'].sudo().search([('id', '=', id)], limit=1)
        if ingredient:
            result = {
                'id': ingredient.id,
                'name': ingredient.name,
                # 'image': str(ingredient.image)
            }
            return json.dumps(result)
        else:
            return json.dumps({'error': 'ingredient not found'})
    
    # Returns ingredients
    @http.route(['/alkoteket/ingredients'], auth='public', type="http", methods=['GET'] )
    def get_cocktails(self, limit=5, offset=0):
        _logger.error(f"{self}")
        limit = int(limit)
        # if limit > 20:
        #     limit = 20
        if limit <= 0:
            limit = 1
        offset = int(offset)
        ingredients = request.env['alkoteket.ingredient'].sudo().search([], offset=offset, limit=limit)
        sorted_ingredients = sorted(ingredients, key=lambda x: x.name, reverse=False)
        ingredient_names = [ingredient.name for ingredient in sorted_ingredients]        
        return json.dumps(ingredient_names)

