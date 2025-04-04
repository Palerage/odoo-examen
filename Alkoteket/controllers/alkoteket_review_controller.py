import json
from odoo import http
from odoo.http import request
import logging
import random
import json
from odoo.http import Response
_logger = logging.getLogger(__name__)

class ReviewController(http.Controller):
    name = "alkoteket.review.api"
    
    @http.route(['/review/create'], type='http', auth="user", methods=['POST'], website=True, csrf=False)
    def create_drink_review(self, **post):   
        if not request.env.user.id:
            return request.redirect('/web/login?redirect=/review/create&message=Please+sign+in+to+submit+a+review')
        
        current_user = request.env.user
        drink_id = post.get('drink_id')
        
        # Check if the request method is POST
        if request.httprequest.method == 'POST':
            # Validate user input
            try:
                score = int(post.get('rating'))
                if score < 1 or score > 5:
                    raise ValueError('Invalid score')
            except (ValueError, TypeError):
                return request.render("alkoteket.error_page", {'error_message': 'Invalid score'})

            review = post.get('comment')
            drink = request.env['alkoteket.drink'].sudo().search([('id', '=', drink_id)])
            if not drink:
                return request.render("alkoteket.error_page", {'error_message': 'Drink not found'})
            elif drink.created_by_id.id == current_user.id:
                return request.render("alkoteket.error_page", {'error_message': 'You cannot create a review for your own drink.'})

            # Check if the user has already reviewed the drink
            existing_review = request.env['alkoteket.drink.review'].sudo().search([
                ('drink_id', '=', int(drink_id)),
                ('created_by_id', '=', int(current_user.id)),
            ])
            
            if existing_review:
                return request.render("alkoteket.error_page", {'error_message': 'You have already reviewed this drink.'})

            # Create a new review
            
            new_review = request.env['alkoteket.drink.review'].sudo().create({
                'score': score,
                'review': review,
                'drink_id': drink_id,
                'created_by_id': current_user.id,  # Set the user who created the review
            })

            # Redirect to the drink's view page
            return request.redirect('/drinkview/?%d' % int(drink_id))

        # If request method is not POST, render the review creation form
        drink = request.env['alkoteket.drink'].sudo().search([('id', '=', drink_id)])
        if not drink:
            return request.render("alkoteket.error_page", {'error_message': 'Drink not found'})

        return request.render("alkoteket.drink_review_form", {'drink': drink})
    
    @http.route('/review/delete/<int:review_id>', type='http', auth='user', website=True, csrf=False)
    def delete_drink_review(self, review_id=None, **kwargs):
        if review_id:
            review = request.env['alkoteket.drink.review'].sudo().search([('id', '=', review_id)])
            if review:
                if review.created_by_id.id == request.env.user.id: # Check if the user who created the review is the same as the current user
                    review.unlink()
                    return request.redirect('/browse') # Redirect to a specific URL after deletion
                else:
                    return request.redirect('/browse') # Redirect to a specific URL if the user is not authorized to delete the review
        return request.redirect('/browse') # Redirect to a specific URL if review_id is not provided or review does not exist
