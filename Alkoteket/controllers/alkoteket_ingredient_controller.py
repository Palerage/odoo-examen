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
        ingredient_names = [ingredient.name for ingredient in ingredients]
        return json.dumps(ingredient_names)
    
    # # Returns 1 random drink
    # @http.route(['/alkoteket/cocktails/random'], auth='public', type="http", methods=['GET'] )
    # def get_random_cocktail(self):
    #     drinks = request.env['alkoteket.drink'].sudo().search([])
    #     random_drink = random.choice(drinks)
    #     result = {
    #         'id': random_drink.id,
    #         'name': random_drink.name
    #     }
    #     return json.dumps(result)
    
    # # Returns a certain amount of random drinks based on the "count" parameter
    # @http.route(['/alkoteket/cocktails/random2'], auth='public', type="http", methods=['GET'] )
    # def get_random_cocktails(self, count=1):
    #     drinks = request.env['alkoteket.drink'].sudo().search([])
    #     random_drinks = random.sample(drinks, min(int(count), len(drinks)))
    #     result = [{
    #         'id': drink.id,
    #         'name': drink.name
    #     } for drink in random_drinks]
    #     return json.dumps(result)
    
    # # Returns drinks based on search in the name
    # @http.route(['/alkoteket/drinks/search/<string:search_string>'], auth='public', type="http", methods=['GET'])
    # def search_drinks(self, search_string):
    #     drinks = request.env['alkoteket.drink'].sudo().search([('name', 'ilike', search_string)])
    #     drink_names = [drink.name for drink in drinks]
    #     return json.dumps(drink_names)
    
    # # Return drink names available based on provided ingredient id's
    # @http.route(['/alkoteket/drinksfiltered'], auth='public', type="http", methods=['GET'])
    # def get_drinks_by_ingredients(self, **kwargs):
    #     try:
    #         ingredients = list(map(int, kwargs.get('ingredients').split(',')))
    #     except:
    #         return json.dumps({'error': 'Please provide valid ingredient ids'})
    #     if ingredients:
    #         drinks = request.env['alkoteket.drink'].sudo().search([])
    #         drink_names = []
    #         for drink in drinks:
    #             add_drink = True
    #             for ingredient in drink.ingredient_amount_ids:
    #                 if ingredient.ingredient_ids.id not in ingredients:
    #                     add_drink = False
    #             if add_drink:
    #                 _logger.error(f"{drink.name} is available")
    #                 drink_names.append(drink.name)
    #         return json.dumps(drink_names)
    #     else:
    #         return json.dumps({'error': 'Please provide ingredient ids'})
        
    # # Return drink names containing provided ingredient id's
    # @http.route(['/alkoteket/drinksfiltered/alt'], auth='public', type="http", methods=['GET'])
    # def get_drinks_by_ingredients_alt(self, **kwargs):
    #     try:
    #         ingredients = list(map(int, kwargs.get('ingredients').split(',')))
    #     except:
    #         return json.dumps({'error': 'Please provide valid ingredient ids'})
    #     if ingredients:
    #         drinks = request.env['alkoteket.drink'].sudo().search([])
    #         drink_names = []
    #         for drink in drinks:
    #             add_drink = False
    #             missing_ingredients = ""
    #             number_of_missing = 0
    #             for ingredient in drink.ingredient_amount_ids:
    #                 if ingredient.ingredient_ids.id in ingredients:
    #                     add_drink = True
    #                 # Show missing ingredients
    #                 else:
    #                     number_of_missing += 1
    #                     missing_ingredients += ingredient.ingredient_ids.name + ","
    #             if add_drink:
    #                 _logger.error(f"{drink.name} is available")
    #                 drink_names.append(f"{drink.name}(missing({number_of_missing}): {missing_ingredients})")
    #         return json.dumps(drink_names)
    #     else:
    #         return json.dumps({'error': 'Please provide ingredient ids'})
    
    # # Return the highest rated drinks
    # @http.route(['/alkoteket/drinks/top_rated'], auth='public', type="http", methods=['GET'])
    # def get_top_rated_drinks(self, count=5):
    #     count = int(count)
    #     drinks = request.env['alkoteket.drink'].sudo().search([])
    #     sorted_drinks = sorted(drinks, key=lambda x: x.average_score, reverse=True)
    #     top_five = sorted_drinks[:count]
    #     top_five_names = [drink.name + f"({drink.average_score})" for drink in top_five]
    #     return json.dumps(top_five_names)