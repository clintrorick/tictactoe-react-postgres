beforeEach( () => {
} )

// The most commonly used query is 'cy.get()', you can
// think of this like the '$' in jQuery
const waitTime = 2000
it( 'Multiple users on the same game', () => {
// https://on.cypress.io/get
    cy.wait( waitTime )
    cy.visit( 'http://localhost:3000/signout' )
    cy.get( '.firebaseui-idp-anonymous' ).as( 'guestLogin-button' )

    cy.get( '.firebaseui-idp-google > .firebaseui-idp-text-long' ).as( 'googleLogin' ).should( 'be.visible' )
    cy.wait( waitTime )
    cy.get( '.firebaseui-idp-anonymous' ).as( 'guestLogin-button' ).should( 'be.visible' ).click()
    cy.wait( waitTime )
    cy.get( '[data-cy=host-new-game]' ).as( 'host-new-game' ).should( 'be.visible' ).click()
    cy.wait( waitTime )
    cy.get( '[data-cy=grid01]' ).as( 'topLeftSquare' )

    cy.get( '@topLeftSquare' ).should( 'not.be.visible' )// opacity = 0
    cy.get( 'span' ).contains( 'Waiting for Opponent' ).as( 'waiting for opponent' ).should( 'be.visible' )
    cy.get( 'span' ).contains( 'You are Naughts' ).as( 'You are naughts' ).should( 'be.visible' )

    cy.get( '[data-cy=grid01]' ).click()
    cy.wait( waitTime )

    cy.location().then( ( loc ) => {
        cy.visit( 'http://localhost:3000/signout' )
        cy.wait( waitTime )
        cy.get( '@guestLogin-button' ).should( 'be.visible' ).click()
        cy.wait( waitTime )

        cy.visit( loc.href )
        cy.get( '@topLeftSquare' ).should( 'not.be.visible' )// opacity = 0
        cy.get( 'span' ).contains( 'Opponent\'s Turn' ).as( 'opponents turn' ).should( 'be.visible' )
        cy.get( 'span' ).contains( 'You are Crosses' ).as( 'You are Crosses' ).should( 'be.visible' )

        // cy.visit( loc.href )
    } )
} )
