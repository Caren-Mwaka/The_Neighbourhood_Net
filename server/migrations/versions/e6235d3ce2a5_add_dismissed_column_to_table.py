"""Add dismissed column to table

Revision ID: e6235d3ce2a5
Revises: 1453660a346d
Create Date: 2024-08-11 06:19:30.258856

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e6235d3ce2a5'
down_revision = '1453660a346d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('notification', schema=None) as batch_op:
        batch_op.add_column(sa.Column('dismissed', sa.Boolean(), nullable=True))
        batch_op.alter_column('message',
               existing_type=sa.VARCHAR(length=500),
               type_=sa.String(length=250),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('notification', schema=None) as batch_op:
        batch_op.alter_column('message',
               existing_type=sa.String(length=250),
               type_=sa.VARCHAR(length=500),
               existing_nullable=False)
        batch_op.drop_column('dismissed')

    # ### end Alembic commands ###