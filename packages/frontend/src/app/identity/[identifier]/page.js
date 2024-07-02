import Identity from './Identity'

export async function generateMetadata ({ params }) {
  return {
    title: 'Identity #' + params.identifier + ' — Dash Platform Explorer',
    description: 'Identity #' + params.identifier + ' on Dash Platform. The Identifier, Balance, Transactions, Transfers, Documents, Data contracts',
    keywords: ['Dash', 'platform', 'explorer', 'blockchain', 'Identity', 'Identifier', 'Balance', 'Transactions', 'Transfers', 'Documents', 'Data contracts'],
    applicationName: 'Dash Platform Explorer'
  }
}

function IdentityRoute ({ params, searchParams }) {
  const tab = String(searchParams.tab) || ''
  return <Identity identifier={params.identifier} defaultTabName={tab}/>
}

export default IdentityRoute
