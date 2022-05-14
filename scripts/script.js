import ContentTemplate from './components/contentTemplate.js';
import FilterTemplate from './components/filterTemplate.js';
import PaginationTemplate from './components/paginationTemplate.js';
import SearchTemplate from './components/searchTemplate.js';
import RequestTemplate from './components/requestTemplate.js';

const pagination = new PaginationTemplate(1, 1, 10, []);
const getRequest = new RequestTemplate(false, false, '', []);
const filter = new FilterTemplate([], '', false);
const search = new SearchTemplate([], '');
const content = new ContentTemplate([]);

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

const addActiveFilterClass = (filterObj) => {
    const activeClass = 'postsTable__head__content_activeFilter';
    const activeFilterElem = document.querySelector(`.${activeClass}`);
    if (activeFilterElem !== null) activeFilterElem.classList.remove(activeClass);
    if (filterObj.activeFilter.length !== 0) {
        document
            .querySelector(`.postsTable__head_${filterObj.activeFilter} img`)
            .classList.add(activeClass);
    }
};

const deleteTableItem = (
    e,
    contentObj,
    filterObj,
    searchObj,
    paginationObj,
) => {
    const postId = e.target.dataset.elemid;
    contentObj.deletePost(postId);
    searchObj.saveSearchList(contentObj.data, searchObj.searchingItem);
    searchingModeVerify(
        filterObj.activeFilter,
        searchObj,
        paginationObj,
        filterObj,
        contentObj,
    );
};

const showTableBody = (paginationObj, contentObj, filterObj, searchObj) => {
    document.querySelector('.postsTable').style.display = 'block';
    document.querySelector('.postsTable__body').innerHTML = '';
    paginationObj.paginatedList.map((item) => {
        document.querySelector('.postsTable__body').innerHTML += `
        <tr>
                <td class="tableBody__item tableBody__item_id">
                    <div class="tableBody__btnContainer">
                        <button class="tableBody__deleteItemBtn" data-elemid=${item.id}>x</button>
                    </div>
                    ${item.id}
                </td>
                <td class="tableBody__item">${item.title}</td>
                <td class="tableBody__item">
                    <div class="tableBody__item_body">${item.body}</div>
                </td>
        </tr>
        `;
    });
    const buttons = document.querySelectorAll('.tableBody__deleteItemBtn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', (e) => deleteTableItem(e, contentObj, filterObj, searchObj, paginationObj));
    }
};

const searchingModeVerify = (
    element,
    searchObj,
    paginationObj,
    filterObj,
    contentObj,
) => {
    if (searchObj.searchingItem.length !== 0) {
        filterObj.turnOnFilter(searchObj.searchList, element);
    } else filterObj.turnOnFilter(contentObj.data, element);
    addActiveFilterClass(filterObj);
    paginationObj.calcListAmount(filterObj.filteredList);
    const diff = paginationObj.allPages - paginationObj.currentPage;
    if (diff < 0) {
        paginationObj.changeCurrentPage(paginationObj.allPages);
    }
    paginationObj.changePaginatedList(filterObj.filteredList);
    showPagination(paginationObj);
    showTableBody(paginationObj, contentObj, filterObj, searchObj);
};

const moveToAnotherPage = (
    event,
    paginationObj,
    filterObj,
    contentObj,
    searchObj,
) => {
    const value = paginationObj.calcValueForTransition(event, paginationObj);
    const data = filterObj.filteredList.length !== 0
        ? filterObj.filteredList
        : contentObj.data;
    if (value !== 0 && value !== paginationObj.allPages + 1) {
        paginationObj.changeCurrentPage(value);
        paginationObj.changePaginatedList(data);
        showTableBody(paginationObj, contentObj, filterObj, searchObj);
        showPagination(paginationObj);
    }
};

const showErrors = (requestObj) => {
    const code = requestObj.isRequestError
        ? `error code: ${getRequest.errorCode}`
        : '';
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
    filterObj,
    searchObj,
) => {
    requestObj.requestSuccess();
    requestObj.saveGetRequest(resultValue);
    contentObj.savePosts(resultValue);
    paginationObj.calcListAmount(resultValue);
    paginationObj.changePaginatedList(resultValue);
    showTableBody(paginationObj, contentObj, filterObj, searchObj);
    showPagination(paginationObj);
};

const sendGet = async (
    url,
    headers,
    requestObj,
    contentObj,
    paginationObj,
    filterObj,
    searchObj,
) => {
    try {
        requestObj.requestBegin();
        loaderOffOn(requestObj);
        const request = await fetch(url, { method: 'GET', headers });
        const result = await request.json();
        if (result.status === 'error') errorGetRequest(result, requestObj);
        else {
            successGetRequest(
                result,
                requestObj,
                contentObj,
                paginationObj,
                filterObj,
                searchObj,
            );
        }
        loaderOffOn(requestObj);
    } catch {
        fatalGetRequest(requestObj);
    }
};

const sendGetRequest = async (requestObj, contentObj, paginationObj, filterObj, searchObj) => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    // const url = 'https://bankproject.free.beec';
    // const url = 'https://bankproject.free.beeceptor.com/test';
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    await sendGet(url, headers, requestObj, contentObj, paginationObj, filterObj, searchObj);
};

sendGetRequest(getRequest, content, pagination, filter, search);

const filtering = (event, searchObj, paginationObj, filterObj, contentObj) => {
    const filterBy = event.target.dataset.filterby;
    if (filterObj.activeFilter === filterBy) {
        filterObj.turnOffFilter();
        searchingModeVerify('', searchObj, paginationObj, filterObj, contentObj);
    } else if (filterBy !== undefined) {
        searchingModeVerify(
            filterBy,
            searchObj,
            paginationObj,
            filterObj,
            contentObj,
        );
    }
};

const changeSearchingValue = (
    event,
    searchObj,
    paginationObj,
    filterObj,
    contentObj,
) => {
    searchObj.saveSearchList(contentObj.data, event.target.value);
    searchingModeVerify(
        filterObj.activeFilter,
        searchObj,
        paginationObj,
        filterObj,
        contentObj,
    );
};

const paginationOptionsOnPage = document.querySelectorAll(
    '.pagination__option',
);
paginationOptionsOnPage[0].addEventListener('click', (e) => moveToAnotherPage(e, pagination, filter, content, search));
paginationOptionsOnPage[1].addEventListener('click', (e) => moveToAnotherPage(e, pagination, filter, content, search));

document
    .querySelector('.pagination__numbers')
    .addEventListener('click', (e) => moveToAnotherPage(e, pagination, filter, content, search));

const filterOptionsOnPage = document.querySelectorAll('.postsTable__head th');
filterOptionsOnPage[0].addEventListener('click', (e) => filtering(e, search, pagination, filter, content));
filterOptionsOnPage[1].addEventListener('click', (e) => filtering(e, search, pagination, filter, content));
filterOptionsOnPage[2].addEventListener('click', (e) => filtering(e, search, pagination, filter, content));

document
    .querySelector('.searching__input')
    .addEventListener('input', (e) => changeSearchingValue(e, search, pagination, filter, content));
