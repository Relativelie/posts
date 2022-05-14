import ContentTemplate from '../components/content/contentTemplate.js';
import FilterTemplate from '../components/filter/filterTemplate.js';
import PaginationTemplate from '../components/pagination/paginationTemplate.js';
import SearchTemplate from '../components/search/searchTemplate.js';
import RequestTemplate from '../components/request/requestTemplate.js';

const pagination = new PaginationTemplate(1, 1, 10, []);
const getRequest = new RequestTemplate(false, false, '', []);
const filter = new FilterTemplate([], '', false);
const search = new SearchTemplate([], '');
const content = new ContentTemplate();

const range = (start, end) => Array(end - start + 1)
    .fill(undefined)
    .map((_, idx) => start + idx);

const showPagination = (paginationObj) => {
    const parentClass = '.pagination__numbers';
    document.querySelector(parentClass).innerHTML = '';
    [...range(1, paginationObj.allPages)].map((item) => {
        document.querySelector(parentClass).innerHTML += `
        <p class="${paginationObj.paginateItemClass(item)}">${item}</p>
        `;
    });
};

const showTableBody = (paginationObj) => {
    document.querySelector('.postsTable').style.display = 'block';
    document.querySelector('.postsTable__body').innerHTML = '';
    paginationObj.paginatedList.map((item) => {
        document.querySelector('.postsTable__body').innerHTML += `
        <tr>
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.body}</td>
        </tr>
        `;
    });
};

const moveToAnotherPage = (event, paginationObj) => {
    const value = paginationObj.calcValueForTransition(event, paginationObj);
    if (value !== 0 && value !== paginationObj.allPages + 1) {
        paginationObj.changeCurrentPage(value);
        paginationObj.changePaginatedList(content.data);
        showTableBody(paginationObj);
        showPagination(paginationObj);
    }
};

const showErrors = (requestObj) => {
    const code = requestObj.isRequestError ? `error code: ${getRequest.errorCode}` : '';
    document.querySelector(
        '.error',
    ).textContent = `${getRequest.requestErrorText} ${code}`;
};

const loaderOffOn = (objName) => {
    const displayValue = objName.isRequestLoading ? 'block' : 'none';
    document.querySelector('.loadingSpinner').style.display = displayValue;
};

const fatalGetRequest = (requestObj) => {
    requestObj.requestFatal();
    showErrors(requestObj);
    loaderOffOn(getRequest);
};

const errorGetRequest = (resultValue, requestObj) => {
    requestObj.requestError(resultValue.code);
    showErrors(requestObj);
};

const successGetRequest = (
    resultValue,
    requestObj,
    contentObj,
    paginationObj,
) => {
    requestObj.requestSuccess();
    requestObj.saveGetRequest(resultValue);
    contentObj.savePosts(resultValue);
    paginationObj.calcListAmount(resultValue);
    paginationObj.changePaginatedList(resultValue);
    showTableBody(paginationObj);
    showPagination(paginationObj);
};

const sendGet = async (url, headers, requestObj, contentObj, paginationObj) => {
    try {
        requestObj.requestBegin();
        loaderOffOn(requestObj);
        const request = await fetch(url, { method: 'GET', headers });
        const result = await request.json();
        if (result.status === 'error') errorGetRequest(result, requestObj);
        else successGetRequest(result, requestObj, contentObj, paginationObj);
        loaderOffOn(requestObj);
    } catch {
        fatalGetRequest(requestObj);
    }
};

const sendGetRequest = async (requestObj, contentObj, paginationObj) => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    // const url = 'https://bankproject.free.beec';
    // const url = 'https://bankproject.free.beeceptor.com/test';
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    await sendGet(url, headers, requestObj, contentObj, paginationObj);
};

sendGetRequest(getRequest, content, pagination);

const searchingModeVerify = (element, searchObj, paginationObj, filterObj) => {
    if (searchObj.searchingItem.length !== 0) {
        filterObj.turnOnFilter(searchObj.searchList, element);
    } else filterObj.turnOnFilter(content.data, element);
    paginationObj.changePaginatedList(filterObj.filteredList);
    showTableBody(paginationObj);
};

const filtering = (event, searchObj, paginationObj, filterObj) => {
    const filterBy = event.target.dataset.filterby;
    if (filterObj.activeFilter === filterBy) {
        filterObj.turnOffFilter();
        searchingModeVerify('', searchObj, paginationObj, filterObj);
    } else if (filterBy !== undefined) {
        searchingModeVerify(filterBy, searchObj, paginationObj, filterObj);
    }
};

const changeSearchingValue = (event, searchObj, paginationObj, filterObj) => {
    searchObj.saveSearchList(content.data, event.target.value);
    searchingModeVerify(filterObj.activeFilter, searchObj, paginationObj, filterObj);
};

const paginationOptionsOnPage = document.querySelectorAll(
    '.pagination__option',
);
paginationOptionsOnPage[0].addEventListener('click', (e) => moveToAnotherPage(e, pagination));
paginationOptionsOnPage[1].addEventListener('click', (e) => moveToAnotherPage(e, pagination));

document
    .querySelector('.pagination__numbers')
    .addEventListener('click', (e) => moveToAnotherPage(e, pagination));

const filterOptionsOnPage = document.querySelectorAll('.postsTable__head th');
filterOptionsOnPage[0].addEventListener('click', (e) => filtering(e, search, pagination, filter));
filterOptionsOnPage[1].addEventListener('click', (e) => filtering(e, search, pagination, filter));
filterOptionsOnPage[2].addEventListener('click', (e) => filtering(e, search, pagination, filter));

document
    .querySelector('.searching__input')
    .addEventListener('input', (e) => changeSearchingValue(e, search, pagination, filter));
