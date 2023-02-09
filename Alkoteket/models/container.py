from odoo import api, fields, models, _

class AlkoteketContainer(models.Model):
    _name = "alkoteket.container"
    _description = "Container"
    
    name = fields.Char(string='Name', required=True)
    volume = fields.Integer(string='Volume(Cl)', required=True)

    note = fields.Text(string='Description')
    image = fields.Binary(string='Container Image')
    
    @api.model
    def create(self, vals):
        if not vals.get('note'):
            vals['note'] = 'New container'
                
        res = super(AlkoteketContainer, self).create(vals)

        return res