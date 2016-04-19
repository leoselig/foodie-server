export const authSchema = {
	"title": "/auth",
	"type": "object",
	"properties": {
		"provider": {
			"type": {
        "enum": ["facebook"]
      }
		},
		"lastName": {
			"type": "string"
		},
		"age": {
			"description": "Age in years",
			"type": "integer",
			"minimum": 0
		}
	},
	"required": ["provider"]
};
