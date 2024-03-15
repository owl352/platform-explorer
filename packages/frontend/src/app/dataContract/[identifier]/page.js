import DataContract from './DataContract'


export async function generateMetadata({ params }) {
    return {
        title: 'Data Contract #' + params.identifier + ' — Dash Platform Explorer',
        description: '',
        keywords: ['Dash', 'platform', 'explorer', 'blockchain', 'data contract'],
        applicationName: 'Dash Platform Explorer'
    }
}

function DataContractRoute({params}) {
    return <DataContract identifier={params.identifier}/>
}

export default DataContractRoute
