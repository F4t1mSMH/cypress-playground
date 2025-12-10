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

it('Cypress Locator Methods', () => {
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

it('Child Elements', () => {

    cy.contains('nb-card', 'Using the Grid').find('.row').find('button') //identical 

    cy.get('nb-card').find('nb-radio-group').contains('Option 1')

    cy.get('nb-card nb-radio-group').contains('Option 1')

    cy.get('nb-card > nb-card-body [placeholder="Jane Doe"]')
})

it('Parent Elements', () => {

    cy.get('#inputEmail1').parents('form').find('button')

    cy.contains('Using the Grid').parent().find('button') //identical 

    cy.get('#inputEmail1').parentsUntil('nb-card-body').find('button') //until stops at nb-card-body
})

it('Cypress Chains', () => {
    cy.get('#inputEmail1')
        .parents('form')
        .find('button')
        .click() // break the chain after action command

    cy.get('#inputEmail1')
        .parents('form')
        .find('nb-radio')
        .first()
        .should('have.text', 'Option 1')
})
it('Reusing Locators', () => {

    //THIS WILL NOT WORK!!! DON"T DO LIKE THIS!!!
    //const inputEmail1 = cy.get('#inputEmail1') 
    //inputEmail1.parents('form').find('button') 
    //inputEmail1.parents('form').find('nb-radio')

    // 1. Cypress Alias / become golbal with "as" keyword
    cy.get('#inputEmail1').as('inputEmail1')
    cy.get('@inputEmail1').parents('form').find('button')
    cy.get('@inputEmail1').parents('form').find('nb-radio')

    // 2. Cypress then() method - use when you need to work with the element itself

    cy.get('#inputEmail1').then( inputEmail => { // inputEmail is a jQuery object
        cy.wrap(inputEmail).parents('form').find('button') //using wrap back to Cypress chain
        cy.wrap(inputEmail).parents('form').find('nb-radio')
        cy.wrap('Hello').should('equal', 'Hello')
        cy.wrap(inputEmail).as('inputEmail2') // you can'tuse return
    })

    cy.get('@inputEmail2').click()

})


it('Extracting Values', () => {
    // 1. using a JQuery method
    cy.get('[for="exampleInputEmail1"]').then( label => {
        const emailLabel = label.text()
        console.log(emailLabel)
    })

    // 2. Using invoke command
    cy.get('[for="exampleInputEmail1"]').invoke('text').then(emailLabel => {
        console.log(emailLabel)
    })
    cy.get('[for="exampleInputEmail1"]').invoke('text').as('emailLabel')
    cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

    // 3. Invoke attribute value
    cy.get('#exampleInputEmail1').invoke('attr', 'class').then(classValue => {
        console.log(classValue)
    })
    //shortcut // validate attribute value only
    cy.get('#exampleInputEmail1').should('have.attr', 'class', 'input-full-width size-medium status-basic shape-rectangle nb-transition')

    // 4. Invoke input field value
    cy.get('#exampleInputEmail1').type('test@test.com')
    cy.get('#exampleInputEmail1').invoke('prop', 'value').then( value => { //prop gets properties
        console.log(value)
    })
})

it('Assertions', () => {
    //have is to get exact value
    cy.get('[for="exampleInputEmail1"]').should('have.text', 'Email address')
    //different way to write the same assertion
    cy.get('[for="exampleInputEmail1"]').then( label => {
        expect(label).to.have.text('Email address')
    })
    //using the extracted value
    cy.get('[for="exampleInputEmail1"]').invoke('text').then( emailLabel => {
        expect(emailLabel).to.equal('Email address')
        cy.wrap(emailLabel).should('equal', 'Email address')
    })
   //look for the documentation to undersatnd more about assertions
})

it.only('Timeouts', () => {
    cy.contains('Modal & Overlays').click()
    cy.contains('Dialog').click()

    cy.contains('Open with delay 10 seconds').click()
    cy.get('nb-dialog-container nb-card-header', {timeout: 11000}) // the timeout for this alert only
        .should('have.text', 'Friendly reminder')
})