# SRFSC backend commands (run from srfsc_backend/). See README.md.
VENV = .venv
PYTHON = $(VENV)/bin/python

$(PYTHON): requirements.txt
	python3 -m venv $(VENV)
	$(PYTHON) -m pip install -q -r requirements.txt
	@touch $(PYTHON)

run: $(PYTHON)
	$(PYTHON) main.py

test: $(PYTHON)
	$(PYTHON) -m unittest discover -s tests -v

docker:
	docker compose up --build -d

.PHONY: run test docker
