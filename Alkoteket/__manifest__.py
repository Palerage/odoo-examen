# -*- coding: utf-8 -*-
{
    'name': "Alkoteket MaxT",
    'version': '1.1',
    'summary': 'Drink Management Software',
    'sequence': -199,
    'description': """Drink Management Software""",
    'category': 'Theme',
    'website': "https://www.odoomates.tech",
    'license': 'LGPL-3',
    'depends': ['website'],
    'data': [
        'security/ir.model.access.csv',
        'data/data.xml',
        'views/assets.xml',
        'views/drink_view.xml',
        'views/ingredient_view.xml',
        'views/ingredient_amount_view.xml',
        'views/container_view.xml',
        'views/drink_review_view.xml',
        'views/snippets/show_drinks.xml',
        'views/snippets/drink_page.xml',
        'views/snippets/profile_drinks.xml',
        'views/snippets/fav_drinks.xml',
        'views/snippets/show_ingredients.xml',
        'views/snippets/snippets.xml',
    ],
    # 'assets':{
    #     'web.assets_frontend':[
            
    #         'Alkoteket/static/src/js/show_drinks.js',
            
    #     ],
    # },
    'demo': [],
    'qweb': [],
    'installable': True,
    'application': False,
    'auto_install': False,
}
