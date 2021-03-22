# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

FROM mongo

WORKDIR /home

# Copy seed data
COPY . .

# Restore data
CMD mongorestore --host mongodb --drop --gzip --dir ./seeds
