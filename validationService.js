const ValidationService = (() => {
    const defaultLang = 'tr';

    const getTargetLang = () => {
        const browserLang = navigator.language.split('-')[0];
        return sessionStorage.getItem('selectedLanguage') || browserLang || defaultLang;
    };

    const customTranslateText = (text, sourceLang, targetLang, callback) => {
        translateText(text, sourceLang, targetLang, (translatedText) => {
            callback(translatedText || text);
        });
    };

    const validateField = ({ id, type, minLength, errorId, errorMessages }) => {
        const inputElement = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        const value = inputElement?.value.trim();
        const targetLang = getTargetLang();

        let errorMessage = "";

        if (!value) {
            errorMessage = errorMessages.empty;
        } else if (minLength && value.length < minLength) {
            errorMessage = errorMessages.short;
        } else if (type === 'email' && !validateEmail(value)) {
            errorMessage = errorMessages.invalid;
        }

        if (errorMessage) {
            customTranslateText(errorMessage, 'auto', targetLang, (translatedError) => {
                showTranslatedError(translatedError || errorMessage, errorElement);
            });
            return false;
        } else {
            errorElement.textContent = "";
            errorElement.classList.remove('active');
            return true;
        }
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showTranslatedError = (message, errorElement) => {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    };

    return {
        validateField,
        customTranslateText,
        showTranslatedError,
        getTargetLang,
    };
})();
