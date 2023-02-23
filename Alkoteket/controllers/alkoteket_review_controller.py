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
    
    @http.route(['/review/create'], type='http', auth="user", website=True, csrf=False)
    def create_drink_review(self, **post):
        _logger.error("--------------------POST DATA-------------------------" + str(post))
        current_user = request.env.user
        drink_id = post.get('drink_id')

        # Check if the request method is POST
        if request.httprequest.method == 'POST':
            # Validate user input
            try:
                score = int(post.get('rating'))
                _logger.error(score)
                if score < 1 or score > 5:
                    raise ValueError('Invalid score')
            except (ValueError, TypeError):
                _logger.error("------------------1----------------------")
                return request.render("alkoteket.error_page", {'error_message': 'Invalid score'})

            review = post.get('comment')
            # if not review:
            #     _logger.error("------------------2----------------------")
            #     return request.render("alkoteket.error_page", {'error_message': 'Review cannot be empty'})

            # Check if current user is the creator of the drink
            drink = request.env['alkoteket.drink'].sudo().search([('id', '=', drink_id)])
            if not drink:
                _logger.error("------------------3----------------------")
                return request.render("alkoteket.error_page", {'error_message': 'Drink not found'})
            elif drink.created_by_id.id == current_user.id:
                _logger.error("------------------4----------------------")                
                return request.render("alkoteket.error_page", {'error_message': 'You cannot create a review for your own drink.'})

            # Check if the user has already reviewed the drink
            existing_review = request.env['alkoteket.drink.review'].sudo().search([
                ('drink_id', '=', drink_id),
                ('created_by_id', '=', current_user.id),
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
            scores = drink.drink_review_ids.mapped('score')
            _logger.error(f"---------------------------{score}---------------------------")
            average_score = round(sum(scores) / len(scores), 2) if scores else 0.0
            drink.write({'average_score': average_score})
            # Redirect to the drink's view page
            return request.redirect('/drinkview/?%d' % int(drink_id))

        # If request method is not POST, render the review creation form
        drink = request.env['alkoteket.drink'].sudo().search([('id', '=', drink_id)])
        if not drink:
            return request.render("alkoteket.error_page", {'error_message': 'Drink not found'})
        return request.render("alkoteket.drink_review_form", {'drink': drink})