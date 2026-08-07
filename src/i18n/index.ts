import deDE from "./locales/de-DE";
import enGB from "./locales/en-GB";
import { useCallback, useEffect, useState } from "react";

export type LocaleCode = "de-DE" | "en-GB";

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
	tagSystemTest?: TagSystemTestCopy;
	tagInput?: TagInputCopy;
	tagFilter?: TagFilterCopy;
	tabNavigation?: TabNavigationCopy;
	secureFileDisplay?: SecureFileDisplayCopy;
	projectsList?: ProjectsListCopy;
	projectLinks?: projectLinks;
	projectPage?: ProjectPageCopy;
	projectDetails?: ProjectDetailsCopy;
	projectCard?: ProjectCardCopy;
	projectMembers?: ProjectMembersCopy;
	projectInfoCard?: ProjectInfoCardCopy;
	newProjectForm?: NewProjectFormCopy;
	documentationList?: DocumentationListCopy;
	documentationFilter?: DocumentationFilterCopy;
	documentationForm?: DocumentationFormCopy;
	documentationButtons?: DocumentationButtonsCopy;
	deleteProjectDialog?: DeleteProjectDialogCopy;
	deleteOptionDialog?: DeleteOptionDialogCopy;
	deleteDialog?: DeleteDialogCopy;
	dateRangeFilter?: DateRangeFilterCopy;
	audioRecorder?: AudioRecorderCopy;
	landingPage?: LandingPageCopy;
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

export type TagSystemTestCopy = {
	title: string;
	tagInfoLabel: string;
	availableTagsLabel: string;
	standardTagsInfoLabel: string;
	formalTagTypeLabel: string;
	formalInfoLabel: string;
	informalTagTypeLabel: string;
	informalInfoLabel: string;
	externalTagTypeLabel: string;
	externalInfoLabel: string;
	enterTagLabel: string;
	selectedTagsLabel: string;
	noTagsSelectedLabel: string;
	instructionsHeader: string;
	availableTagsInstruction: string;
	chooseOrCreateTagInstruction: string;
	addTagInstruction: string;
	removeTagInstruction: string;
	clickToSearchOrCreateTagLabel:string;

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

export type AudioRecorderCopy = {
	consoleMime: string;
	consoleMimeDefault: string;
	consoleError: string;
	userFacingError: string;
	startRecordingButton: string;
	resumeRecordingButton: string;
	pauseRecordingButton: string;
	stopRecordingButton: string;
	unstartedRecordingStatusLabel: string;
	runningRecordingStatusLabel: string;
	pausedRecordingStatusLabel: string;
	finishedRecordingStatusLabel: string;
	recordingPreviewLabel: string;
	deleteRecordingButton: string;
	useRecordingButton: string;
}
export type DateRangeFilterCopy = {
  	monthnames: string[];
	calenderTooltipTitle: string;
	fullTimeframeTooltipTitle: string;
	shortCutTodayButton: string;
	closeCalenderButton: string;
	fromLabel: string;
	untilLabel: string;
	fullTimeframeButton: string;
	resetButton: string;
};
export type DeleteDialogCopy = {
	confirmText: string;
	cancelText: string;
};
export type DeleteOptionDialogCopy = {
	deleteOptionTitle: string;
	deleteOptionMessage: string;
};
export type projectLinks = {
	linkLoadConsoleError: string;
	linkLoadError: string;
	deleteLinkConfirmation: string;
	deleteLinkConsoleError: string;
	deleteLinkErrorUserAlert: string;
	enterNameError: string;
	enterUrlError: string;
	saveLinkConsoleError: string;
	saveLinkError: string;
	interationAndWorkSpaces: string;
	noLinksAvailable: string;
	editButton: string;
	deleteButton: string;
	addLinkButton: string;
	linkNameLabel: string;
	egGithubPlaceholder: string;
	requiredLabel: string;
	editSaveButton: string;
	editAddButton: string;
	cancelButton: string;
}

export type DeleteProjectDialogCopy = {
	deleteProjectTitle: string;
	deleteProjectMessage: string;
	deleteProjectMessage_1: string;
	deleteProjectMessage_2: string;

};
export type DocumentationButtonsCopy = {
	documentationLabel: string;
};
export type DocumentationFormCopy = {
	consoleMessage:string;
		consoleError:string;
		userAlert:string;
		consoleSuccess:string;
		consoleFinish:string;
		userAlertFinish:string;
		generalConsoleError: string;
		userErrorAlert: string;
		uploadConsoleMessage: string;
		uploadAudioConsoleError:string;
		uploadAudioSuccessConsoleMessage: string;
		uploadAudioGeneralConsoleError: string;
		uploadAudioErrorUserAlert:string;
		meetingDocumentationTypeButton: string;
		interviewDocumentationTypeButton: string;
		fieldNoteDocumentationTypeButton: string;
		archiveDocumentationTypeButton:string;
		editDocoumentationTypeButton: string;
		createDocoumentationTypeButton: string;
		documentationTypeLabel: string;
		nameLabel: string;
		placeholderDocumentationNameTitle: string;
		dateLabel: string;
		liveDocumentationTypeNotesLabel: string;
		liveDocumentationTypeDescriptionLabel: string;
		placeholderNotesTitle: string;
		placeholderDocumentationDescriptionTitle: string;
		tagsLabel: string;
		placeholderTagSelectionTitle: string;
		statusLabel: string;
		completeOptionLabel:string;
		incompleteOptionLabel: string;
		startingTimeOptionalLabel: string;
		endingTimeOptionalLabel: string;
		finishedTimeLabel: string;
		meetingTypeLabel: string;
		pleaseChooseDropdownOption: string;
		onlineOptionDropdownOption: string;
		offlineOptionDropdownOption: string;
		hybridOptionDropdownOption: string;
		clientLabel: string;
		clientOrWithoutClientPlaceholderLabel: string;
		surnamePlaceholderLabel: string;
		addMemberLabel: string;
		lastnamePlaceholderLabel: string;
		emailPlaceholderLabel: string;
		postitionPlaceholderLabel: string;
		membersLabel:string;
		interviewTypeLabel:string;
		addCoreQuestionButton:string;
		coreQuestionLabel:string;
		coreQuestionLabel_2:string;
		questionPlaceholder:string;
		answer:string;
		dialogueButton: string;
		dialogueText: string;
		dialoguePlaceholder:string;
		audioRecordingLabel: string;
		startRecordingButton: string;
		audioReadyLabel: string;
		removeRecordingButton: string;
		uploadFilesLabel: string;
		uploadingLabel: string;
		uploadedFilesLabel: string;
		cancelButton: string;
		saveButton: string;


};
export type DocumentationFilterCopy = {
	statusAllDropdownOption: string;
	statusIncompleteDropdownOption: string;
	statusCompleteDropdownOption: string;
	documentationTypeButtonMeeting: string;
	documentationTypeButtonInterview: string;
	documentationTypeButtonArchiveDocumentation: string;
	documentationTypeButtonFieldNote: string;
	statusLabel: string;
	exportLabel: string;
	exportingWordLabel: string;
	exportingPDFLabel: string;
	exportWordDropdownOption: string;
	exportPDFDropdownOption: string;
};
export type DocumentationListCopy = {
	deselectAllLabel: string;
	selectAllLabel: string;
	expandLabel: string;
	collapseLabel: string;
	archiveLabel: string;
	meetingLabel: string;
	interviewLabel: string;
	documentationLabel: string;
	completeOption: string;
	incompleteOption: string;
	editLabel: string;
	deleteLabel: string;
	descriptionLabel: string;
	personsLabel: string;
	coreQuestionsLabel: string;
	answerLabel: string;
	attachedFilesLabel: string;
	noDocumantationWithSelectedFiltersFoundLabel: string;

};
export type NewProjectFormCopy = {
	projectNamePlaceholder: string;
	projectDescriptionPlaceholder: string;
	pleaseChooseLabel: string;
	onLocationOption: string;
	hybridOption: string;
	remoteOption: string;
	createLabel: string;
	cancelLabel: string;
	projectDescriptionLabel: string;
	workingMethodLabel: string;
};
export type ProjectInfoCardCopy = {

	enterNameUserAlert: string;
	nameSaveConsoleError: string;
	descriptionSaveConsoleError: string;
	saveLabel: string;
	cancelLabel: string;
	editLabel: string;
	deleteLabel: string;
	descriptionPlaceholder: string;
	noDescriptionLabel: string;
	createdAtLabel: string;
	lastChange: string;
	onLocation: string;
	hybrid: string;
	remote: string;
	workingMethod: string;

};
export type ProjectMembersCopy = {
	rpcFunctionConsoleError: string;
	viewFallbackConsoleWarning: string;
	viewFallbackConsoleError: string;
	sqlSetupConsoleError: string;
	loadedEmailAddressesViaView: string;
	emailMapAfterView: string;
	viewDidNotReturnDataWarning: string;
	viewFallbackConsoleError_2: string;
	enterEmailUserError: string;
	userNotFoundUserAlert: string;
	addedMemberSuccessUserAlert: string;
	addMemberErrorUserAlert: string;
	addMemberConsoleError: string;
	gotViewDataConsoleLog: string;
	gotRPCDataConsoleLog: string;
	loadedEmailAddressesViaRPCConsoleLog: string;
	emailMapAfterRPCConsoleLog: string;
	rpcFunctionDidNotReturnDataWarning: string;
	emailAddressLoadingConsoleError: string;
	sqlSetupNecessaryConsoleError: string;
	loadedEmailAddresses: string;
	numberOfLoadedEmailAddresses: string;
	userIdOfProjectOwner: string;
	emailOfProjectOwner: string;
	loadingMembersConsoleError: string;
	pleaseEnterEmailConsoleError: string;
	emailPlaceholder: string;
	addNewMemberButton: string;

	removeMemberConfirmation: string;
	removedMemberSuccessUserAlert: string;
	removedMemmberConsoleError: string;
	removedMemberErrorUserAlert: string;
	enterEmailUserAlert: string;
	rpcConsoleError: string;
	sqlFunctionNotCreatedUserAlert: string;
	userNotFoundCheckPossibilitesUserAlert: string;
	userAlreadyMemberUserAlert: string;
	addedMemberConsoleError: string;
	addMemberErrorUserAlert_2: string;
	membersLabel: string;
	loadingMembersLabel: string;
	noMembersYetLabel: string;
	userLabel: string;
	ownerAccessLabel: string;
	readAccessLabel: string;
	writeAccessLabel: string;
	removeLabel: string;
	instructionsLabel: string;
	instructionsText_1: string;
	instructionsText_2: string;
	instructionsText_3: string;
	instructionsText_4: string;
	instructinonsText_5: string;
	emailNotFoundLabel: string;
	emailNotFoundShortLabel: string;

};
export type ProjectCardCopy = {
	deleteButtonLabel: string;
	createdLabel: string;
	lastChangeLabel: string;
	workingMethodLabel: string;
	onLocationLabel: string;
	hybridLabel: string;
	remoteLabel: string;
	optionsLabel: string;
	clickNameForDetails: string;
	clickToExpand: string;

};
export type ProjectDetailsCopy = {
	//eventuelll usestate alle/fertig/unfertig ändern
	documentationLoadConsoleError: string;
	deleteDocumentationConfirmation: string;
	documentationDeletationConsoleError: string;
	documentationDeletedUserAlert: string;
	documentationSuccessfullyDeletedUserAlert: string;
	documentationDeleteErrorUserAlert: string;
	projectDescriptionSuccessfullySavedUserAlert: string;
	noFilesInSelectedTimeframeUserAlert: string;
	successfullyExportedDocumentationAsWordFileUserAlert_1:string;
	successfullyExportedDocumentationAsWordFileUserAlert_2:string;
	videoFileInfoLabel:string;
	imageEmbedErrorPdfText: string;
	//eventuell archiv meeting invterview etc ändern
	fileCheckConsoleError: string;
	projectPeopleLoadConsoleError: string;
	nameSaveConsoleError: string;
	nameSaveUserAlert: string;
	projectNameSuccessfullySavedUserAlert: string;
	descriptionSaveConsoleError: string;
	descriptionSaveErrorUserAlert: string;
	// eventuell "projekte" ändern
	noDocumentationInSelectedTimeframeUserAlert: string;
	noDocumentationInSelectedTimeframeWithSelectedFiltersUserAlert: string;
	signedUrlGenerationConsoleError: string;
	signedUrlLoadError: string;
	downloadConsoleError: string;
	interviewTypeLabel: string;
	fileConsoleError: string;
	fileDownloadSuccessUserAlert_1:string;
	fileDownloadSuccessUserAlert_2:string;
	fileDownloadConsoleError:string;
	fileDownloadErroUserAlert:string;
	imageConsoleError:string;
	projectDocumentationLabel:string;
	timeframeLabel:string;
	exportedOnLabel:string;
	documentationParagraphLabel:string;
	nameLabel:string;
	typeLabel:string;
	archiveLabel:string;
	meetingLabel:string;
	interviewLabel:string;
	fieldNoteLabel:string;
	documentationLabel:string;
	dateLabel:string;
	timeLabel:string;
	descriptionLabel:string;
	meetingTypeLabel:string;
	onlineLabel:string;
	offlineLabel:string;
	hybridLabel:string;
	participantsLabel:string;
	clientLabel:string;
	personsLabel:string;
	dialogsLabel:string;
	coreQuestionsLabel:string;
	questionsLabel:string;
	answersLabel:string;
	addedFiles:string;
	imageEmbedConsoleError:string;
	imageEmbedErrorTextRun:string;
	videoFileLabel:string;
	videoFileNotDisplayableInfoLabel:string;
	audioFile:string
	audioFileNotDisplayableInfoLabel:string;
	//eventuell documentationen is anpassen
	documentationExportConsoleError:string;
	documentationExportErrorUserAlert: string;
	documentationForProject: string;
	audioFileInfoLabel: string;
	successfullyExportedDocumentationAsPDFFileUserAlert_1: string;
	successfullyExportedDocumentationAsPDFFileUserAlert_2: string;
	PdfExportConsoleError: string;
	PdfExportErrorUserAlert: string;
	documentationSaveConsoleError: string;
	documentationSaveErrorUserAlert: string;
	documentationSuccessfullyUpdatedUserAlert: string;
	documentationSuccessfullySavedUserAlert: string;
	noDocumentationForDate: string;
	noDocumentationForTimeframe: string;
	noDocumentation: string;
	
};	
export type ProjectPageCopy = {
	//eventuell /Projekte/ ändern
	//eventuell Personeen ändern
	createError: string;

};
export type ProjectsListCopy = {
	loadingProjectsLabel: string;
	noProjectsLabel: string;
};
export type SecureFileDisplayCopy = {
	signedUrlGenerationConsoleError: string;
	downloadConsoleError: string;
	// eventuell müssen file.type.startsWith('image/'); etc. angepagsst werden
	loadingLabel: string;
	downloadLabel: string;
	noVideoPreviewAvailableMessage: string;
	noAudioPreviewAvailableMessage: string;
	fileGenerationError: string;
};
export type TabNavigationCopy = {
	deleteOptionLabel: string;
	showCalenderLabel: string;
	todayLabel: string;
	// Locale der Kalenderanzeige muss ggf. noch in TabNavigation angepasst werden bei new Date(selectedDate).toLocaleDateString('de-DE')

};
export type TagFilterCopy = {
	header: string;
	deleteAllButton: string;
	noTagsLabel: string;
	filteredUsingLabel: string;
	
};
export type TagInputCopy = {
	enterTagPlaceholder: string;
	tagLoadConsoleError: string;
	formalFormalityType: string;
	informalFormalityType: string;
	externalFormalityType: string;
	standardTagAddConsoleError: string;
	standardTagInitializationConsoleError: string;
	tagSaveDatabaseConsoleError: string;
	tagAddConsoleError: string;
	tagAddUserAlert: string;
	addTagLabel: string;
};

export const defaultLocale: LocaleCode = "de-DE";

export const localeStorageKey = "ethno-log-locale";
export const localeChangeEventName = "ethno-log-locale-change";

export const locales: Record<LocaleCode, LocaleMessages> = {
	"de-DE": deDE,
	"en-GB": enGB,
};

export const localeLabels: Record<LocaleCode, string> = {
	"de-DE": "Deutsch",
	"en-GB": "English (UK)",
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
