export default class RequestTemplate {
    constructor(
        isRequestLoading,
        isRequestSuccess,
        isRequestError,
        errorCode,
        result,
    ) {
        this.isRequestLoading = isRequestLoading;
        this.isRequestSuccess = isRequestSuccess;
        this.isRequestError = isRequestError;
        this.errorCode = errorCode;
        this.result = result;
    }

    requestErrorText = 'Something went wrong...';

    requestSuccess = () => {
        this.isRequestSuccess = true;
        this.isRequestLoading = false;
    };

    requestBegin = () => {
        this.isRequestLoading = true;
    };

    requestFatal = () => {
        this.isRequestLoading = false;
    };

    requestError = (value) => {
        this.isRequestLoading = false;
        this.isRequestError = true;
        this.errorCode = value;
    };

    saveGetRequest = (data) => {
        this.result = [...data];
    };
}
