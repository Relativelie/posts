import PaginationTemplate from '../components/pagination/paginationTemplate.js';
import SendRequest from './requests.js';

const GetRequest = new SendRequest();
const Pagination = new PaginationTemplate();
Pagination.itemsPerPage = 10;
Pagination.currentPage = 1;
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
    document.querySelector('.postsTable__body').innerHTML = '';
    Pagination.paginatedList.map((item) => {
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

const showTableOnPage = () => {
    showLoader();
    if (!GetRequest.isRequestLoading) {
        if (GetRequest.isRequestSuccess) showTableBody();
        else if (GetRequest.isRequestError) showErrors('error');
        else showErrors('fatal');
    }
};

const range = (start, end) => Array(end - start + 1)
    .fill(undefined)
    .map((_, idx) => start + idx);

const paginateItemClass = (value) => {
    const activeClass = 'pagination__number_isActive';
    const ordinaryClass = 'pagination__number';
    if (value === Pagination.currentPage) {
        return `${ordinaryClass} ${activeClass}`;
    }
    return `${ordinaryClass}`;
};

const moveToAnotherPage = (event) => {
    const eventType = event.target.dataset.pagination;
    let value;
    if (eventType === 'next') {
        value = Pagination.currentPage + 1;
    } else if (eventType === 'prev') {
        value = Pagination.currentPage - 1;
    } else value = parseInt(event.target.innerText, 10);
    if (value !== 0 && value !== Pagination.allPages + 1) {
        Pagination.changeCurrentPage(value);
        Pagination.changePaginatedList(GetRequest.result);
        showTableBody();
        document.querySelector('.pagination__number_isActive').classList.remove('pagination__number_isActive');
        document.querySelector(`.pagination__numbers :nth-child(${value})`).classList.add('pagination__number_isActive');
    }
};

const showPagination = () => {
    document.querySelector('.pagination__numbers').innerHTML = '';
    [...range(1, Pagination.allPages)].map((item) => {
        document.querySelector('.pagination__numbers').innerHTML += `
        <p class="${paginateItemClass(item)}">${item}</p>
        `;
    });
};

const sendGet = async (url, headers) => {
    try {
        GetRequest.sendRequestBegin();
        showTableOnPage();
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
            showTableOnPage();
        } else {
            GetRequest.sendRequestSuccess();
            GetRequest.saveGetRequest(result);
            Pagination.calcListAmount(result);
            Pagination.changePaginatedList(result);
            showTableOnPage();
            showPagination();
        }
    } catch (err) {
        GetRequest.sendRequestFatal();
        showTableOnPage();
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

const paginationOptionsOnPage = document.querySelectorAll('.pagination__option');
paginationOptionsOnPage[0].addEventListener('click', (e) => moveToAnotherPage(e));
paginationOptionsOnPage[1].addEventListener('click', (e) => moveToAnotherPage(e));

document.querySelector('.pagination__numbers').addEventListener('click', (e) => moveToAnotherPage(e));
