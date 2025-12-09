/// <reference types="cypress" />

beforeEach('open test application',()=>{
    cy.visit('/')
    cy.contains('Forms').click()
    cy.contains('Form Layouts').click()
})

it('hello world1', ()=> {
    //by tag name
    cy.get('input')
    //by id need #
    cy.get('#inputEmail1')
    //by class name
    cy.get('.input-full-width')
    //by attribute 
    cy.get('[fullwidth]')
    //by attribute name and value
    cy.get('[placeholder="Email"]')
    //by class value
    cy.get('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')
    //how to combine different attribute
    cy.get('[placeholder="Email"][fullwidth]')
    cy.get('input[placeholder="Email"]')
    //find data-cy attribute
    cy.get('[data-cy="inputEmail1"]')
})

it.only('Cypress Locator Methods', () => {
    //Theory
    //get() - to find elments on the page globally
    //find() - to find only child elements
    //contains() - to find web elements by text

    cy.contains('Sign in')
    cy.contains('[status="warning"]', 'Sign in')
    cy.contains('nb-card', 'Horizontal form').find('button')
    cy.contains('nb-card', 'Horizontal form').contains('Sign in')
    cy.contains('nb-card', 'Horizontal form').get('button')


})