.PHONY: help bootstrap seal-portfolio seal-alerting seal-telegram seal-grafana backup-key status urls smoke destroy image

help:            ## list targets
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-16s %s\n", $$1, $$2}'

bootstrap:       ## create kind cluster, install Argo CD, apply root app
	scripts/bootstrap.sh

seal-portfolio:  ## seal Telegram credentials (needs TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
	scripts/seal-secrets.sh portfolio

seal-alerting:   ## seal Alertmanager's Telegram receiver credentials
	scripts/seal-secrets.sh alerting

seal-telegram: seal-portfolio seal-alerting ## seal Telegram for both the app and Alertmanager

seal-grafana:    ## seal a Grafana admin password
	scripts/seal-secrets.sh grafana

backup-key:      ## back up the sealed-secrets private key to .secrets/
	scripts/seal-secrets.sh backup-key

status:          ## Argo CD apps and portfolio workload
	kubectl get applications -n argocd
	kubectl get deploy,pods,hpa,ingress -n portfolio

urls:            ## local endpoints
	@echo "app         http://portfolio.localtest.me"
	@echo "argocd      http://argocd.localtest.me"
	@echo "grafana     http://grafana.localtest.me"
	@echo "prometheus  http://prometheus.localtest.me"
	@echo "jaeger      http://jaeger.localtest.me"

smoke:           ## check the deployed version and a user journey
	scripts/smoke.sh http://portfolio.localtest.me

image:           ## build the image locally
	docker build -t portfolio:local --build-arg GIT_SHA=$$(git rev-parse HEAD) .

destroy:         ## delete the kind cluster
	kind delete cluster --name portfolio
