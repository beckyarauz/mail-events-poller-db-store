build-env:
	docker run -t -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} node:12 node -e 'console.log(process.env.AWS_ACCESS_KEY_ID);';
	docker run -t -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} node:12 node -e 'console.log(process.env.AWS_SECRET_ACCESS_KEY);';
	docker run -t -e AWS_REGION=${AWS_REGION} node:12 node -e 'console.log(process.env.AWS_REGION);';
	docker run -t -e STATE_MACHINE_ARN=${STATE_MACHINE_ARN} node:12 node -e 'console.log(process.env.STATE_MACHINE_ARN);';

build:
	docker build -t ${PROJECT_NAME} .;

run-local:
	docker run -t  \
	 -e STATE_MACHINE_ARN=${STATE_MACHINE_ARN} \
	 -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
	 -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
	 -e AWS_REGION=${AWS_REGION} \
	 -p ${PORT}:8080 ${PROJECT_NAME}:latest;

stats:
	docker stats;

test:
	curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"event-data": {"event": "TestEvent-Local"}}';

create-repo:
	aws ecr create-repository --repository-name ${PROJECT_NAME} --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE;

upload:
	aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_USER}.dkr.ecr.${AWS_REGION}.amazonaws.com;
	docker tag  ${PROJECT_NAME}:latest ${AWS_USER}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}:latest
	docker push ${AWS_USER}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}:latest;

update:
	aws lambda update-function-code \
        --function-name  ${FUNCTION_NAME} \
        --image-uri ${ECR_URI};
