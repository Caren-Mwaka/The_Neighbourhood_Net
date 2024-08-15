"""empty message

Revision ID: 43a0112d943a
Revises: a385be2b18ae
Create Date: 2024-08-16 01:15:06.337872

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '43a0112d943a'
down_revision = 'a385be2b18ae'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('incident', schema=None) as batch_op:
        batch_op.add_column(sa.Column('solved', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('incident', schema=None) as batch_op:
        batch_op.drop_column('solved')

    # ### end Alembic commands ###
