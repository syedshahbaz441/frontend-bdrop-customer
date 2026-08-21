import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the admin app shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('BuddyDrop');
    expect(compiled.textContent).toContain('Keep the drop moving.');
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
