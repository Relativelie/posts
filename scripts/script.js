import ContentTemplate from './components/contentTemplate.js';
import FilterTemplate from './components/filterTemplate.js';
import PaginationTemplate from './components/paginationTemplate.js';
import SearchTemplate from './components/searchTemplate.js';
import RequestTemplate from './components/requestTemplate.js';

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
                <td class="tableBody__item tableBody__item_id">${item.id}</td>
                <td class="tableBody__item">${item.title}</td>
                <td class="tableBody__item">
                    <div>${item.body}</div>
                </td>
        </tr>
        `;
    });
};

const moveToAnotherPage = (event, paginationObj, filterObj, contentObj) => {
    const value = paginationObj.calcValueForTransition(event, paginationObj);
    const data = filterObj.filteredList.length !== 0 ? filterObj.filteredList : contentObj.data;
    if (value !== 0 && value !== paginationObj.allPages + 1) {
        paginationObj.changeCurrentPage(value);
        paginationObj.changePaginatedList(data);
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

const addActiveFilterClass = (filterObj) => {
    const activeClass = 'postsTable__head__content_activeFilter';
    const activeFilterElem = document.querySelector(`.${activeClass}`);
    if (activeFilterElem !== null) activeFilterElem.classList.remove(activeClass);
    if (filterObj.activeFilter.length !== 0) {
        document.querySelector(`.postsTable__head_${filterObj.activeFilter} img`).classList.add(activeClass);
    }
};

const searchingModeVerify = (element, searchObj, paginationObj, filterObj, contentObj) => {
    if (searchObj.searchingItem.length !== 0) {
        filterObj.turnOnFilter(searchObj.searchList, element);
    } else filterObj.turnOnFilter(contentObj.data, element);
    addActiveFilterClass(filterObj);
    paginationObj.calcListAmount(filterObj.filteredList);
    paginationObj.changeCurrentPage(1);
    paginationObj.changePaginatedList(filterObj.filteredList);
    showPagination(paginationObj);
    showTableBody(paginationObj);
};

const filtering = (event, searchObj, paginationObj, filterObj, contentObj) => {
    const filterBy = event.target.dataset.filterby;
    if (filterObj.activeFilter === filterBy) {
        filterObj.turnOffFilter();
        searchingModeVerify('', searchObj, paginationObj, filterObj, contentObj);
    } else if (filterBy !== undefined) {
        searchingModeVerify(filterBy, searchObj, paginationObj, filterObj, contentObj);
    }
};

const changeSearchingValue = (event, searchObj, paginationObj, filterObj, contentObj) => {
    searchObj.saveSearchList(contentObj.data, event.target.value);
    searchingModeVerify(filterObj.activeFilter, searchObj, paginationObj, filterObj, contentObj);
};

const paginationOptionsOnPage = document.querySelectorAll(
    '.pagination__option',
);
paginationOptionsOnPage[0].addEventListener('click', (e) => moveToAnotherPage(e, pagination, filter, content));
paginationOptionsOnPage[1].addEventListener('click', (e) => moveToAnotherPage(e, pagination, filter, content));

document
    .querySelector('.pagination__numbers')
    .addEventListener('click', (e) => moveToAnotherPage(e, pagination, filter, content));

const filterOptionsOnPage = document.querySelectorAll('.postsTable__head th');
filterOptionsOnPage[0].addEventListener('click', (e) => filtering(e, search, pagination, filter, content));
filterOptionsOnPage[1].addEventListener('click', (e) => filtering(e, search, pagination, filter, content));
filterOptionsOnPage[2].addEventListener('click', (e) => filtering(e, search, pagination, filter, content));

document
    .querySelector('.searching__input')
    .addEventListener('input', (e) => changeSearchingValue(e, search, pagination, filter, content));
