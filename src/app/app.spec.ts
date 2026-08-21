import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the customer app shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')?.textContent).toContain('BuddyDrop');
    expect(compiled.textContent).toContain('Book a service');
  });

  it('should switch between admin views', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const catalogueButton = compiled.querySelectorAll<HTMLButtonElement>('.nav-item')[1];

    catalogueButton.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.catalogue-view')).toBeTruthy();
    expect(compiled.querySelector('.users-view')).toBeNull();
  });
});
