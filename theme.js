import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
//-- Epal.gg:
// #8D65EA 		: Purple (primary)
// #1FB995			: Green (secondary)
// #c265eb --> 8d65ea 	: Gradient Purple
// #2f2e49 		: background
// #474664			: card background
// #f9f9f9			: primary text
// #c4c3e6			: secondary text

const theme = createMuiTheme({
	"palette": {
		"common": {
			"black": "rgba(0, 0, 0, 1)",
			"white": "#fff"
    },
    
		"background": {
			"paper": "rgba(71, 70, 100, 1)",
			"default": "rgba(47, 46, 73, 1)"
    },
    
		"primary": {
			"light": "#7986cb",
			"main": "rgba(141, 101, 234, 1)",
			"dark": "#303f9f",
			"contrastText": "rgba(249, 249, 249, 1)"
    },
    
		"secondary": {
			"light": "#ff4081",
			"main": "rgba(29, 143, 226, 1)",
			"dark": "#c51162",
			"contrastText": "rgba(249, 249, 249, 1)"
    },
    
		"error": {
			"light": "#e57373",
			"main": "#f44336",
			"dark": "#d32f2f",
			"contrastText": "#fff"
    },
    
		"text": {
			"primary": "rgba(249, 249, 249, 1)",
			"secondary": "rgba(196, 195, 230, 1)",
			"disabled": "rgba(0, 0, 0, 0.38)",
			"hint": "rgba(54, 52, 52, 0.38)"
    }
    
	}
})

export default theme;