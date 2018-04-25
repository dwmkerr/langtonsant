# Build the dist package.
build:
	npm install
	npm run bundle

# Copy to the S3 bucket.
deploy:
	aws s3 sync ./dist s3://langtonsant.com
