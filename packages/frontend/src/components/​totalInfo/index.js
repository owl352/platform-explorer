import './TotalInfo.scss'
import './TotalInfoItem.scss'

import {
  Box,
  Container,
  Flex
} from '@chakra-ui/react'

function TotalInfo ({ blocks, transactions, dataContracts, documents, transfers }) {
  return (
        <Container
            className={'TotalInfo'}
            maxW={'none'}
            borderColor={'gray.800'}
            py={0}
            mt={8}
            mb={8}
        >
            <Flex
                className={'TotalInfo__ContentContainer'}
                justify={'space-around'}
                maxW={'container.xl'}
                wrap={'wrap'}
            >
                <div className='TotalInfo__Item'>
                    <div className={'TotalInfoItem TotalInfoItem--Blocks'}>
                        <div className={'TotalInfoItem__Title'}>Blocks</div>
                        <div className={'TotalInfoItem__Value'}>{`${blocks || '-'}`}</div>
                    </div>
                </div>

                <Box className={'TotalInfo__Divider'}></Box>

                <div className='TotalInfo__Item'>
                    <div className={'TotalInfoItem TotalInfoItem--Transactions'}>
                        <div className={'TotalInfoItem__Title'}>Transactions</div>
                        <div className={'TotalInfoItem__Value'}>{`${transactions || '-'}`}</div>
                    </div>
                </div>

                <Box className={'TotalInfo__Divider'} display={['none', 'none', 'block', ,]}></Box>

                <div className='TotalInfo__Item'>
                    <div className={'TotalInfoItem TotalInfoItem--DataContracts'}>
                        <div className={'TotalInfoItem__Title'}>Data Contracts</div>
                        <div className={'TotalInfoItem__Value'}>{`${dataContracts || '-'}`}</div>
                    </div>
                </div>

                <Box className={'TotalInfo__Divider'} display={['block', 'block', 'block', ,]}></Box>

                <div className='TotalInfo__Item'>
                    <div className={'TotalInfoItem TotalInfoItem--Documents'}>
                        <div className={'TotalInfoItem__Title'}>Documents</div>
                        <div className={'TotalInfoItem__Value'}>{`${documents || '-'}`}</div>
                    </div>
                </div>

                <Box className={'TotalInfo__Divider'} display={['none', 'none', 'block', ,]}></Box>

                <div className='TotalInfo__Item'>
                    <div className={'TotalInfoItem TotalInfoItem--Transfers'}>
                        <div className={'TotalInfoItem__Title'}>Transfers</div>
                        <div className={'TotalInfoItem__Value'}>{`${transfers || '-'}`}</div>
                    </div>
                </div>
            </Flex>
        </Container>
  )
}

export default TotalInfo
