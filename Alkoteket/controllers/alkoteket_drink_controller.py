import json
from odoo import http
from odoo.http import request
import logging
import random
import json
from odoo.http import Response
_logger = logging.getLogger(__name__)

class AlkoteketDrinkController(http.Controller):
    _name = "alkoteket.api"
    
    # Returns drink info based on id
    @http.route(['/alkoteket/drink/<int:id>'], auth='public', type="json", methods=['POST'] )
    def get_drink_by_id(self, id):
        drink = request.env['alkoteket.drink'].sudo().search([('id', '=', id)], limit=1)
        ingredients = []
        reviews = []
        user = request.env['res.users'].sudo().browse(request.session.uid)
        favourited = False
        if drink:
            if id in user.fav_drinks.ids:
                favourited = True
            else:
                favourited = False
            
            for ingredient in drink.ingredient_amount_ids:
                ingredients.append({'id' : ingredient.ingredient_ids.id, 'name' : ingredient.ingredient_ids.name, 'qty' : ingredient.qty})
            for review in drink.drink_review_ids:
                reviews.append({'reviewer_name' : review.create_uid.name, 'score' : review.score, 'review' : review.review, 'created' : str(review.create_date.strftime("%Y-%m-%d %H:%M"))})
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
                'reviews': reviews,
                'favourite' : favourited
            }
            # _logger.error(json.dumps(result))
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
        elif limit <= 0:
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
        random_drinks = sorted(random_drinks, key=lambda x: x.average_score, reverse=True)
        result = []
        for drink in random_drinks:
            ingredients = []
            for ingredient in drink.ingredient_amount_ids:
                ingredients.append({'id' : ingredient.ingredient_ids.id, 'name' : ingredient.ingredient_ids.name, 'qty' : ingredient.qty})
            temp = {
                'id': drink.id,
                'name': drink.name,
                'image' : str(drink.image)[2:-1],
                'average_score' : drink.average_score,
                'ingredients' : ingredients
            }
            result.append(temp)
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
        if id == 0:
            id = request.env.user.id
        drinks = request.env['alkoteket.drink'].sudo().search([('create_uid', '=', id)])
        result = [{
            'id': drink.id,
            'name': drink.name,
            'average_score' : drink.average_score,
            'image' : str(drink.image)[2:-1]
        } for drink in drinks]
        return json.dumps(result)
    
    # Returns favourite drinks based on id
    @http.route(['/alkoteket/favouritesbyuser/<int:id>'], auth='public', type="json", methods=['POST'] )
    def get_favourites_by_user(self, id):
        if id == 0:
            id = request.env.user.id
            
        _logger.error(f"-----UserID-------- {request.env.user.id}")
        _logger.error(f"-----UserName-------- {request.env.user.name}")
        # _logger.error(f"-----UserFavourites-------- {request.env.user.fav_drinks[0].name}")
        
        
        user = request.env['res.users'].sudo().browse(int(id))
        fav_drinks = user.fav_drinks
        result = [{
            'id': drink.id,
            'name': drink.name,
            'average_score' : drink.average_score,
            'image' : str(drink.image)[2:-1]
        } for drink in fav_drinks]
        return json.dumps(result)
    
    @http.route(['/alkoteket/addfavourite/<int:drinkId>'], auth='user', type="json", methods=['POST'] )
    def add_favourite(self, drinkId):
        current_user = request.env.user
        # if current_user.id == 4:
        #     return
        current_user.sudo().write({'fav_drinks': [(4, drinkId)]})
        return json.dumps({'code': 'successfully added'})
    
    @http.route(['/alkoteket/removefavourite/<int:drinkId>'], auth='user', type="json", methods=['POST'])
    def remove_favourite(self, drinkId):
        current_user = request.env.user
        # if current_user.id == 4:
        #     return
        drink = request.env['alkoteket.drink'].sudo().browse(drinkId)
        fav_drinks = current_user.fav_drinks
        fav_drinks -= drink
        current_user.write({'fav_drinks': [(3, drinkId)]})
        return json.dumps({'code': 'successfully removed'})
    
    
    @http.route(['/alkoteket/createdrink'], type='http', auth='user', methods=['POST'], csrf=False)
    def create_drink(self, **kwargs):
        _logger.error(f"---------------------KWARGS----------------------------{kwargs}")
        
        _logger.error(f"---------------------KWARGS-INGREDIENTS----------------------------{kwargs.get('ingredients')}")
        # https://www.w3docs.com/snippets/javascript/how-to-convert-the-image-into-a-base64-string-using-javascript.html
        drink_name = kwargs.get('drink_name')
        drink_type = 'alcoholic'# kwargs.get('drink_type')
        ingredients = kwargs.get('ingredients')
        note = kwargs.get('note')        
        image = kwargs.get('image')
        user_id = request.env.user.id

        drink = request.env['alkoteket.drink'].sudo().create({
            'name': str(drink_name.title()),
            'type': str(drink_type),
            'created_by_id': str(user_id),
            'note': str(note),
            'image': str(image)
        })

        ingredients = json.loads(kwargs.get('ingredients'))
        
        if ingredients:
            for ingredient in ingredients:
                ingredient_amount = ingredient.get('ingredient_amount')
                ingredient_id = ingredient.get('ingredient_id')
                request.env['alkoteket.ingredient.amount'].sudo().create({
                    'drink_id': drink.id,
                    'ingredient_ids': ingredient_id,
                    'qty': ingredient_amount
                })

        return Response(json.dumps({'drink_id': drink.id}), content_type='application/json')