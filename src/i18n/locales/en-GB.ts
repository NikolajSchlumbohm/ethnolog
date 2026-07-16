import type { LocaleMessages } from "..";

const enGB: LocaleMessages = {
	landingPage: {
		eyebrow: "Digital ethnography",
		title: "Welcome to Ethno-Log",
		subtitle:
			"This platform supports everyday ethnographic work with clear workflows, documentation, and practical tools.",
		primaryAction: "Go to projects",
		secondaryAction: "Choose language",
		languagePanelLabel: "Select a language",
		languageHint:
			"Your selection is stored locally and restored the next time you open the app.",
		infoCardLabel: "What you get here",
		highlights: [
			{
				label: "Focus",
				value: "Document and structure your research",
			},
			{
				label: "Goal",
				value: "Move from idea to active analysis faster",
			},
		],
		infoPoints: [
			"clear navigation for recurring research tasks",
			"consistent language handling with local persistence",
			"a foundation for translating the rest of the app",
		],
	},
	sidebar: {
		title: "Ethno-Log",
		home: "Home Page",
		projects: "Projects",
		profile: "Profile",
		openMenuLabel: "Open menu",
		closeMenuLabel: "Close menu",
		projectsLinkTitle: "Projects",
	},
	sidebarLogin: {
		loggedInAsLabel: "Logged in as:",
		logout: "Logout",
		logoutLoading: "Logging out...",
		localTestMode: "Local test mode active.",
		emailPlaceholder: "E-Mail-address",
		passwordPlaceholder: "Password",
		login: "Login",
		loginLoading: "Logging in...",
		register: "Register",
		registerLoading: "Please wait...",
		loginSuccess: "Login successful!",
		localRegisterSuccess: "Local test login created!",
		registerSuccess: "Registration successful! Please confirm your email.",
	},
	projectsPage: {
		loginPrompt: "Please log in or register",
		title: "Projects",
		subtitle: "Here are all your projects displayed. Click on a project to open it.",
		newProjectButton: "+ Create New Project",
		deleteTitle: "Delete Project",
		deleteMessage: "Do you really want to delete this project? This action cannot be undone.",
		deleteConfirm: "Delete",
		deleteCancel: "Cancel",
	},
};

export default enGB;
