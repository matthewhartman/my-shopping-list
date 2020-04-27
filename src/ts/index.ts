import { Item } from './interfaces';
import { APP_NAME } from './constants';

export class MyShoppingList {

  private host: HTMLElement;
  private items: Array<Item>;

  constructor(host: HTMLElement) {
    this.host = host;
    this.items = [];
  }

  public init(): void {
    this.loadLocalStorageItems().then(() => {
      this.render();
      this.bindEvents();
    });
  }

  public render(): void {
    this.host.insertAdjacentHTML('afterbegin', `
      <div class="container">
        <h1 class="logo">My Shopping List</h1>
        <div class="items"></div>
      </div>
    `);
    const itemsEl = this.host.querySelector('.items') as HTMLElement;
    if (itemsEl !== null) {
      this.items.map((item: Item) => {
        itemsEl.insertAdjacentHTML('beforeend', `
          <form autocomplete="off" id="item-${item.id}" class="row edit-item">
            <input class="edit-input" data-id="${item.id}" type="text" name="item" value="${item.value}" />
            <button
              type="button"
              class="delete-button delete-item"
              data-id="${item.id}"
            ></button>
          </form>
        `);
    });
    itemsEl.insertAdjacentHTML('beforeend', `
      <form autocomplete="off" class="row add-item">
        <input class="add" type="text" name="item" placeholder="Add item..." />
        <input class="add-button add" type="submit" value="+" />
      </form>
    `);
    }
  }

  public bindEvents(): void {
    this.host.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      const targetEl = event.target as HTMLElement;
      if (targetEl.closest('.add-item') !== null) {
        const inputEl = targetEl.querySelector('input[type="text"]') as HTMLInputElement;
        this.addItem(inputEl);
        inputEl.value = '';
      }
    });
    this.host.addEventListener('input', (event: Event) => {
      const targetEl = event.target as HTMLInputElement;
      if (targetEl.closest('.edit-input') !== null) {
        this.updateItem(targetEl);
      }
    });
    this.host.addEventListener('click', (event: Event) => {
      const targetEl = event.target as HTMLButtonElement;
      if (targetEl.closest('.delete-item') !== null) {
        this.removeItem(targetEl);
      }
    });
  }

  public addItem(inputEl: HTMLInputElement): void {
    const addFormEl = this.host.querySelector('.add-item') as HTMLFormElement;
    // Generate Random ID
    // Try to avoid having duplicate IDs as they may clash
    const id = 'i-' + Math.random().toString(36).substr(2, 8);
    const value = inputEl.value;
    this.items.push({id, value});
    addFormEl.insertAdjacentHTML('beforebegin', `
      <form autocomplete="off" id="item-${id}" class="row edit-item">
        <input class="edit-input" data-id="${id}" type="text" name="item" value="${inputEl.value}" />
        <button
          type="button"
          class="delete-button delete-item"
          data-id="${id}"
        >
        </button>
      </form>
    `);
    this.updateLocalStorageItems(this.items);
  }

  public updateItem(inputEl: HTMLInputElement): void {
    const id = inputEl.getAttribute('data-id');
    const value = inputEl.value;
    const updateItems = this.items.map((item: Item) => {
      if (item.id === id) {
        return { id, value };
      }
      return item;
    });
    this.items = updateItems;
    this.updateLocalStorageItems(this.items);
  }

  public removeItem(buttonEl: HTMLButtonElement): void {
    const id = buttonEl.getAttribute('data-id');
    const updateItems = this.items.filter((item: Item) => item.id !== id);
    if (buttonEl.closest('.edit-item') !== null) {
      buttonEl.closest('.edit-item')?.remove();
    }
    this.items = updateItems;
    this.updateLocalStorageItems(this.items);
  }

  public updateLocalStorageItems(items: Array<Item>): void {
    const localStorageObj = localStorage.getItem(APP_NAME);
    if (localStorageObj !== null) {
      localStorage.setItem(APP_NAME, JSON.stringify(items));
    }
  }

  public loadLocalStorageItems(): Promise<void> {
    return new Promise((resolve) => {
      const localStorageObj = localStorage.getItem(APP_NAME);
      if (localStorageObj !== null) {
        this.items = JSON.parse(localStorageObj);
      } else {
        localStorage.setItem(APP_NAME, '[]');
      }
      resolve();
    });
  }
}

// Initialise the class to run
const app = document.querySelector('#app') as HTMLElement;
if (app !== null) {
  const application = new MyShoppingList(app as HTMLElement);
  application.init();
}
