# Gasless Fee-Bump Architecture

Lumen removes gas friction from Stellar transactions:

1. The client signs an inner transaction with fee = 0.
2. The server wraps the transaction in a \`FeeBumpTransaction\`.
3. The server signs as the fee payer and submits to the network.
4. The user's account never holds or expends XLM for transaction fees.
