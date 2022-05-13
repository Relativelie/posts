import Pagination from './pagination.js';
import SendRequest from './requests.js';

const GetRequest = new SendRequest();
GetRequest.requestErrorText = 'Something went wrong...';

const showLoader = () => {
    if (GetRequest.isRequestLoading) {
        document.querySelector('.loadingSpinner').style.display = 'block';
    } else {
        document.querySelector('.loadingSpinner').style.display = 'none';
    }
};

const showTableBody = () => {
    document.querySelector('.postsTable').style.display = 'block';
    GetRequest.result.map((item) => {
        document.querySelector('.postsTable__body').innerHTML += `
        <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.body}</td>
        </tr>
        `;
    });
};

const showErrors = (elemClassName) => {
    const code = elemClassName === 'error' ? `error code: ${GetRequest.errorCode}` : '';
    document.querySelector(`.${elemClassName}`).textContent = `${GetRequest.requestErrorText} ${code}`;
};

const showItemsOnPage = () => {
    showLoader();
    if (!GetRequest.isRequestLoading) {
        if (GetRequest.isRequestSuccess) showTableBody();
        else if (GetRequest.isRequestError) showErrors('error');
        else showErrors('fatal');
    }
};

const sendGet = async (url, headers) => {
    try {
        GetRequest.sendRequestBegin();
        showItemsOnPage();
        const request = await fetch(
            url,
            {
                method: 'GET',
                headers,
            },
        );
        const result = await request.json();
        if (result.status === 'error') {
            GetRequest.sendRequestError(result.code);
            showItemsOnPage();
        } else {
            GetRequest.sendRequestSuccess();
            GetRequest.saveGetRequest(result);
            showItemsOnPage();
        }
    } catch (err) {
        GetRequest.sendRequestFatal();
        showItemsOnPage();
    }
};

const sendGetRequest = async () => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    // const url = 'https://bankproject.free.beeceptor.com/test';
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    await sendGet(url, headers);
};

sendGetRequest();
const PaginationBlock = new Pagination();


