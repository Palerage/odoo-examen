import json
from odoo import http
from odoo.http import request
import logging
import random
_logger = logging.getLogger(__name__)

class AlkoteketDrinkController(http.Controller):
    
    _name = "alkoteket.api"
    
       # Returns drink id and name based on id
    @http.route(['/alkoteket/drink/<int:id>'], auth='public', type="json", methods=['POST'] )
    def get_drink_by_id(self, id):
        # _logger.error(request.env.user.name)
        drink = request.env['alkoteket.drink'].sudo().search([('id', '=', id)], limit=1)
        # _logger.error(str(drink.create_date))
        ingredients = []
        reviews = []
        
        # _logger.error(str(reviews))
        if drink:            
            for ingredient in drink.ingredient_amount_ids:
                ingredients.append({'id' : ingredient.ingredient_ids.id, 'name' : ingredient.ingredient_ids.name, 'qty' : ingredient.qty})
            for review in drink.drink_review_ids:
                reviews.append({'reviewer_name' : review.create_uid.name, 'score' : review.score, 'review' : review.review})
            result = {
                'id': drink.id,
                'name': drink.name,
                'note' : drink.note,
                'ingredients' : ingredients,
                'alcohol_percentage' : round(drink.alcohol_percentage * 100, 1),
                'average_score' : drink.average_score,
                'image' : str(drink.image)[2:-1],
                'creator_name': str(drink.create_uid.name),
                'creator_id': str(drink.create_uid.id),
                'drink_create_date': str(drink.create_date),
                'review_amount': len(drink.drink_review_ids),
                'reviews': reviews
            }
            return json.dumps(result)
        else:
            return json.dumps({'error': 'Drink not found'})
    
    # Returns non-alcoholic drinks
    @http.route(['/alkoteket/mocktails'], auth='public', type="http", methods=['GET'] )
    def get_mocktails(self, limit=5, offset=0):
        limit = int(limit)
        offset = int(offset)
        drinks = request.env['alkoteket.drink'].sudo().search([('type', '=', 'nonalcoholic')], offset=offset, limit=limit)
        if drinks:        
            drink_names = [drink.name for drink in drinks]
            return json.dumps(drink_names)
        else:
            return json.dumps({'error': 'No mocktails found'})
    
    # Returns alcoholic drinks
    @http.route(['/alkoteket/cocktails'], auth='public', type="http", methods=['GET'] )
    def get_cocktails(self, limit=5, offset=0):
        _logger.error(f"{self}")
        limit = int(limit)
        if limit > 20:
            limit = 20
        if limit <= 0:
            limit = 1
        offset = int(offset)
        drinks = request.env['alkoteket.drink'].sudo().search([('type', '=', 'alcoholic')], offset=offset, limit=limit)
        drink_names = [drink.name for drink in drinks]
        return json.dumps(drink_names)
    
    # Returns 1 random drink
    @http.route(['/alkoteket/cocktails/random'], auth='public', type="http", methods=['GET'] )
    def get_random_cocktail(self):
        drinks = request.env['alkoteket.drink'].sudo().search([])
        random_drink = random.choice(drinks)
        result = {
            'id': random_drink.id,
            'name': random_drink.name
        }
        return json.dumps(result)
    
    # Returns a certain amount of random drinks based on the "count" parameter
    @http.route(['/alkoteket/cocktails/random2'], auth='public', type="json", methods=['POST'] )
    def get_random_cocktails(self, count=1):
        drinks = request.env['alkoteket.drink'].sudo().search([])
        random_drinks = random.sample(drinks, min(int(count), len(drinks)))
        # _logger.error(str(drinks[0].image))
        result = [{
            'id': drink.id,
            'name': drink.name,
            'image' : str(drink.image)[2:-1],
            'average_score' : drink.average_score,
        } for drink in random_drinks]
        return json.dumps(result)
    
    # Returns drinks based on search in the name
    @http.route(['/alkoteket/drinks/search/<string:search_string>'], auth='public', type="http", methods=['GET'])
    def search_drinks(self, search_string):
        drinks = request.env['alkoteket.drink'].sudo().search([('name', 'ilike', search_string)])
        drink_names = [drink.name for drink in drinks]
        return json.dumps(drink_names)
    
    # Return drink names available based on provided ingredient id's
    @http.route(['/alkoteket/drinksfiltered'], auth='public', type="http", methods=['GET'])
    def get_drinks_by_ingredients(self, **kwargs):
        try:
            ingredients = list(map(int, kwargs.get('ingredients').split(',')))
        except:
            return json.dumps({'error': 'Please provide valid ingredient ids'})
        if ingredients:
            drinks = request.env['alkoteket.drink'].sudo().search([])
            drink_names = []
            for drink in drinks:
                add_drink = True
                for ingredient in drink.ingredient_amount_ids:
                    if ingredient.ingredient_ids.id not in ingredients:
                        add_drink = False
                if add_drink:
                    _logger.error(f"{drink.name} is available")
                    drink_names.append(drink.name)
            return json.dumps(drink_names)
        else:
            return json.dumps({'error': 'Please provide ingredient ids'})
        
    # Return drink names containing provided ingredient id's
    @http.route(['/alkoteket/drinksfiltered/alt'], auth='public', type="http", methods=['GET'])
    def get_drinks_by_ingredients_alt(self, **kwargs):
        try:
            ingredients = list(map(int, kwargs.get('ingredients').split(',')))
        except:
            return json.dumps({'error': 'Please provide valid ingredient ids'})
        if ingredients:
            drinks = request.env['alkoteket.drink'].sudo().search([])
            drink_names = []
            for drink in drinks:
                add_drink = False
                missing_ingredients = ""
                number_of_missing = 0
                for ingredient in drink.ingredient_amount_ids:
                    if ingredient.ingredient_ids.id in ingredients:
                        add_drink = True
                    # Show missing ingredients
                    else:
                        number_of_missing += 1
                        missing_ingredients += ingredient.ingredient_ids.name + ","
                if add_drink:
                    _logger.error(f"{drink.name} is available")
                    drink_names.append(f"{drink.name}(missing({number_of_missing}): {missing_ingredients})")
            return json.dumps(drink_names)
        else:
            return json.dumps({'error': 'Please provide ingredient ids'})
    
    # Return the highest rated drinks
    @http.route(['/alkoteket/drinks/top_rated'], auth='public', type="http", methods=['GET'])
    def get_top_rated_drinks(self, count=5):
        count = int(count)
        drinks = request.env['alkoteket.drink'].sudo().search([])
        sorted_drinks = sorted(drinks, key=lambda x: x.average_score, reverse=True)
        top_five = sorted_drinks[:count]
        top_five_names = [drink.name + f"({drink.average_score})" for drink in top_five]
        return json.dumps(top_five_names)
    
    # Returns drinks based on created by id
    @http.route(['/alkoteket/cocktailsbyuser/<int:id>'], auth='public', type="json", methods=['POST'] )
    def get_cocktails_by_user(self, id):
        _logger.error(id)
        if id == 0:
            id = request.env.user.id
        _logger.error(id)
        drinks = request.env['alkoteket.drink'].sudo().search([('create_uid', '=', id)])
        result = [{
            'id': drink.id,
            'name': drink.name,
            'average_score' : drink.average_score,
            'image' : str(drink.image)[2:-1]
        } for drink in drinks]
        return json.dumps(result)
    
    