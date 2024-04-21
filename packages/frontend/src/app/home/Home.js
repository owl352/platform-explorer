'use client'

import { useState, useEffect, createRef } from 'react'
import * as Api from '../../util/Api'
import { LineChart } from '../../components/charts/index.js'
import { SimpleList } from '../../components/lists'
import TotalInfo from '../../components/​totalInfo'
import NetworkStatus from '../../components/networkStatus'
import Intro from '../../components/intro/index.js'
import Markdown from '../../components/markdown'
import introContent from './intro.md'
import { getTransitionTypeString } from '../../util/index'

import { 
    Box, 
    Container,
    Heading, 
    Flex,
} from '@chakra-ui/react'

function Home() {
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState(true)
    const [transactions, setTransactions] = useState([])
    const [dataContracts, setDataContracts] = useState([])
    const [identities, setIdentities] = useState([])
    const [transactionHistory, setTransactionHistory] = useState([])

    const fetchData = () => {
        setLoading(true)

        Promise.all([
            Api.getStatus(), 
            Api.getTransactions(1, 3, 'desc'),
            Api.getDataContracts(1, 8, 'desc'),
            Api.getIdentities(1, 5, 'desc')
        ])
        .then(([status, paginatedTransactions, paginatedDataContracts, paginatedIdentities]) => {
            setStatus(status)
            setTransactions(paginatedTransactions.resultSet)
            setDataContracts(paginatedDataContracts.resultSet)
            setIdentities(paginatedIdentities.resultSet)
            setTransactionHistory([
                {x: 10, y: 11111200},
                {x: 11, y: 1111500},
                {x: 13, y: 11111500},
                {x: 16, y: 21111000},
                {x: 17, y: 11111200},
                {x: 18, y: 11111500}
            ])
        })
        .catch(console.log)
        .finally(() => setLoading(false))
    }

    useEffect(fetchData, [])

    if (!loading) return (<>
        <Container 
            maxW={'container.xl'} 
            color={"white"} 
            padding={3}
            mt={8}
            mb={8}
        >
            <Flex 
                justifyContent={'space-between'} 
                alignItems={'center'}
                wrap={['wrap',, 'nowrap']}
            >
                <Container maxW={'none'} p={0}>
                    <Intro 
                        title={'Platform Explorer'}
                        contentSource={<Markdown>{introContent}</Markdown>}
                    />
                </Container>
                
                <Box flexShrink={'0'} w={10} h={10} />
                
                <Container maxW={'none'} p={0}>
                    <NetworkStatus/>
                </Container>
            </Flex>
        </Container>

        <TotalInfo
            blocks={status.blocksCount}
            transactions={status.txCount}
            dataContracts={status.dataContractsCount}
            documents={status.documentsCount}
            transfers={status.transfersCount}
        />
    
        <Container 
            maxW={'container.xl'} 
            color={"white"} 
            padding={3}
            mt={0}
            mb={4}
        >
            <Container p={0} maxW={'container.xl'} mb={[10,,16]}>
                <Flex 
                    w={'100%'} 
                    justifyContent={'space-between'}
                    wrap={["wrap", , , 'nowrap']}
                    mb={5}
                >
                    <Flex
                        maxW={'none'}
                        width={'100%'}
                        mb={5}
                        borderWidth={'1px'} borderRadius={'lg'}
                        direction={'column'}
                        p={3}
                    >
                        <Heading as={'h2'} size={'sm'} px={2} mt={0} mb={6}>Transaction history</Heading>
                        
                        <Container 
                            minH={'220px'}
                            height={["300px", , ,'auto']}
                            maxW={'none'}
                            flexGrow={'1'} 
                            my={3} 
                            py={0} 
                            px={2} 
                        >
                            <LineChart
                                data={transactionHistory}
                                xLabel={'Block height'}
                                yLabel={'Transactions count'}
                            />
                        </Container>
                    </Flex>

                    <Box flexShrink={'0'} w={10} h={[0,,,10]} />

                    <Container
                        maxW={'100%'}
                        borderWidth={'1px'} borderRadius={'lg'}
                        mb={5}
                        className={'InfoBlock'}
                    >
                        <Heading className={'InfoBlock__Title'} as={'h1'} size={'sm'}>Last transactions</Heading>

                        <SimpleList 
                            items={transactions.map((transaction, i) => ({
                                monospaceTitles:[transaction.hash],
                                columns: [new Date(transaction.timestamp).toLocaleString(), getTransitionTypeString(transaction.type)],
                                link: '/transaction/' + transaction.hash
                            }))}
                            columns={['Identifier', 'Amount of txs']} 
                        />
                    </Container>
                </Flex>

                <Flex 
                    w={'100%'} 
                    justifyContent={'space-between'}
                    wrap={["wrap", , 'nowrap']}
                    mb={[10,,16]}
                >
                    <Container m={0} p={0} maxW={['100%',,'calc(50% - 20px)']}>
                        <Container
                            maxW={'100%'}
                            m={0}
                            h={'100%'}
                            borderWidth={'1px'} borderRadius={'lg'}
                            className={'InfoBlock'}
                        >
                            <Heading className={'InfoBlock__Title'} as={'h1'} size={'sm'}>Most popular data contracts</Heading>

                            <SimpleList 
                                items={dataContracts.map((dataContract, i) => ({
                                    monospaceTitles:[dataContract.identifier],
                                    columns: ['I-name-' + i, 10000 - i * 25],
                                    link: '/dataContract/' + dataContract.identifier
                                }))}
                                columns={['Identifier', 'Amount of txs']} 
                            />
                        </Container>
                    </Container>

                    <Box flexShrink={'0'} w={10} h={10} />

                    <Container p={0} maxW={['100%',,'calc(50% - 20px)']}>
                        <Container
                            maxW={'100%'}
                            borderWidth={'1px'} borderRadius={'lg'}
                            className={'InfoBlock'}
                        >
                            <Heading className={'InfoBlock__Title'} as={'h1'} size={'sm'}>Most active Identity</Heading>

                            <SimpleList 
                                items={identities.map((identitiy, i) => ({
                                    columns: [identitiy.identifier, 100 - i * 25],
                                    link: '/identity/' + identitiy.identifier
                                }))}
                                columns={['Identifier', 'Amount of txs']} 
                            />
                        </Container>

                        <Box w={10} h={10} />

                        <Container
                            maxW={'none'}
                            borderWidth={'1px'} borderRadius={'lg'}
                            className={'InfoBlock'}
                        >
                            <Heading className={'InfoBlock__Title'} as={'h1'} size={'sm'}>Richest Identity</Heading>

                            <SimpleList 
                                items={identities.map((identitiy, i) => ({
                                    columns: [identitiy.identifier, 20000 - i * 1555],
                                    link: '/identity/' + identitiy.identifier
                                }))}
                                columns={['Identifier', 'Balance']} 
                            />
                        </Container>
                    </Container>
                </Flex>
            </Container>
        </Container>
    </>)
}

export default Home
