import deDE from "./locales/de-DE";
import enGB from "./locales/en-GB";
import enUS from "./locales/en-US";
import { useCallback, useEffect, useState } from "react";

export type LocaleCode = "de-DE" | "en-GB" | "en-US";

export type LandingPageCopy = {
	eyebrow: string;
	title: string;
	subtitle: string;
	primaryAction: string;
	secondaryAction: string;
	languagePanelLabel: string;
	languageHint: string;
	infoCardLabel: string;
	highlights: Array<{
		label: string;
		value: string;
	}>;
	infoPoints: string[];
};

export type LocaleMessages = {
	landingPage: LandingPageCopy;
	sidebar?: SidebarCopy;
	sidebarLogin?: SidebarLoginCopy;
	projectsPage?: ProjectsPageCopy;
};

export type SidebarCopy = {
	title: string;
	home: string;
	projects: string;
	profile: string;
	openMenuLabel: string;
	closeMenuLabel: string;
	projectsLinkTitle: string;
};

export type SidebarLoginCopy = {
	loggedInAsLabel: string;
	logout: string;
	logoutLoading: string;
	localTestMode: string;
	emailPlaceholder: string;
	passwordPlaceholder: string;
	login: string;
	loginLoading: string;
	register: string;
	registerLoading: string;
	loginSuccess: string;
	localRegisterSuccess: string;
	registerSuccess: string;
};

export type ProjectsPageCopy = {
	loginPrompt: string;
	title: string;
	subtitle: string;
	newProjectButton: string;
	deleteTitle: string;
	deleteMessage: string;
	deleteConfirm: string;
	deleteCancel: string;
};

export const defaultLocale: LocaleCode = "de-DE";

export const localeStorageKey = "ethno-log-locale";
export const localeChangeEventName = "ethno-log-locale-change";

export const locales: Record<LocaleCode, LocaleMessages> = {
	"de-DE": deDE,
	"en-GB": enGB,
	"en-US": enUS,
};

export const localeLabels: Record<LocaleCode, string> = {
	"de-DE": "Deutsch",
	"en-GB": "English (UK)",
	"en-US": "English (US)",
};

export function getLocaleFromValue(value?: string | null): LocaleCode {
	if (value && value in locales) {
		return value as LocaleCode;
	}

	return defaultLocale;
}

export function getLocaleMessages(locale: LocaleCode): LocaleMessages {
	return locales[locale] ?? locales[defaultLocale];
}

export function useLocale() {
	const [locale, setLocaleState] = useState<LocaleCode>(defaultLocale);

	useEffect(() => {
		const syncLocale = () => {
			if (typeof window === "undefined") {
				return;
			}

			const nextLocale = getLocaleFromValue(window.localStorage.getItem(localeStorageKey));
			setLocaleState(nextLocale);
			document.documentElement.lang = nextLocale;
		};

		syncLocale();

		const handleStorage = (event: StorageEvent) => {
			if (event.key === localeStorageKey) {
				syncLocale();
			}
		};

		window.addEventListener("storage", handleStorage);
		window.addEventListener(localeChangeEventName, syncLocale);

		return () => {
			window.removeEventListener("storage", handleStorage);
			window.removeEventListener(localeChangeEventName, syncLocale);
		};
	}, []);

	const setLocale = useCallback((nextLocale: LocaleCode) => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(localeStorageKey, nextLocale);
			document.documentElement.lang = nextLocale;
			window.dispatchEvent(new Event(localeChangeEventName));
		}

		setLocaleState(nextLocale);
	}, []);

	return {
		locale,
		setLocale,
		messages: getLocaleMessages(locale),
	};
}
