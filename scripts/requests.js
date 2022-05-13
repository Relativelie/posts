export default class SendRequest {
    constructor(
        isRequestLoading,
        isRequestSuccess,
        isRequestFatal,
        isRequestError,
        errorCode,
        result,
    ) {
        this.isRequestLoading = isRequestLoading;
        this.isRequestSuccess = isRequestSuccess;
        this.isRequestFatal = isRequestFatal;
        this.isRequestError = isRequestError;
        this.errorCode = errorCode;
        this.result = result;
    }

    static requestErrorText;

    sendRequestSuccess = () => {
        this.isRequestSuccess = true;
        this.isRequestLoading = false;
    };

    sendRequestBegin = () => {
        this.isRequestLoading = true;
    };

    sendRequestFatal = () => {
        this.isRequestFatal = true;
        this.isRequestLoading = false;
    };

    sendRequestError = (value) => {
        this.isRequestError = true;
        this.isRequestLoading = false;
        this.errorCode = value;
    };

    saveGetRequest = (data) => {
        this.result = [...data];
    };
}
