'use client'

import { useEffect, useState, useCallback } from 'react'
import * as Api from '../../util/Api'
import Pagination from '../../components/pagination'
import PageSizeSelector from '../../components/pageSizeSelector/PageSizeSelector'
import { LoadingList } from '../../components/loading'
import { ErrorMessageBlock } from '../../components/Errors'
import { fetchHandlerSuccess, fetchHandlerError } from '../../util'
import { ValidatorsList } from '../../components/validators'

import {
  Container,
  Box,
  Heading
} from '@chakra-ui/react'

const paginateConfig = {
  pageSize: {
    default: 10,
    values: [10, 25, 50, 75, 100]
  },
  defaultPage: 1
}

function Validators () {
  const [validators, setValidators] = useState({ data: {}, loading: true, error: false })
  const [pageSize, setPageSize] = useState(paginateConfig.pageSize.default)
  const [currentPage, setCurrentPage] = useState(0)
  const [total, setTotal] = useState(1)
  const pageCount = Math.ceil(total / pageSize)

  const fetchData = (page, count) => {
    Api.getTransactions(page, count, 'desc')
      .then((res) => {
        res = {
          resultSet: [
            {
              active: true,
              protxhash: 'f92e66edc9c8da41de71073ef08d62c56f8752a3f4e29ced6c515e0b1c074a38',
              lastBlockHeight: '13619',
              blocksProposed: '1010'
            },
            {
              active: true,
              protxhash: 'iHJhyiQSAWHYORdJzDPUSydVOmlIfsmGiIzirPv1bZjI466qn6eg9HqZhlxI0Pts',
              lastBlockHeight: '13618',
              blocksProposed: '1020'
            },
            {
              active: true,
              protxhash: 'G24zk1djskZRdDhLRBTEI9Pm0E1UTYxHW1pCFdgVkvm96mY6LWxfHBsexiGXlWxr',
              lastBlockHeight: '13617',
              blocksProposed: '1030'
            }
          ]
        }
        fetchHandlerSuccess(setValidators, res)
        setTotal(100)
      })
      .catch(err => fetchHandlerError(setValidators, err))
  }

  useEffect(() => fetchData(paginateConfig.defaultPage, pageSize), [pageSize])

  const handlePageClick = useCallback(({ selected }) => {
    setCurrentPage(selected)
    fetchData(selected + 1, pageSize)
  }, [pageSize])

  useEffect(() => {
    setCurrentPage(0)
    handlePageClick({ selected: 0 })
  }, [pageSize, handlePageClick])

  return (
    <Container
        maxW={'container.xl'}
        mt={8}
        className={'Transactions'}
    >
        <Container
            maxW={'container.xl'}
            borderWidth={'1px'} borderRadius={'lg'}
            className={'InfoBlock'}
        >
            <Heading className={'InfoBlock__Title'} as={'h1'} size={'sm'}>Validators</Heading>

            {!validators.error
              ? !validators.loading
                  ? <ValidatorsList validators={validators}/>
                  : <LoadingList itemsCount={pageSize}/>
              : <Container h={20}><ErrorMessageBlock/></Container>
            }

            {validators.data?.resultSet?.length > 0 &&
              <div className={'ListNavigation'}>
                <Box display={['none', 'none', 'block']} width={'100px'}/>
                <Pagination
                    onPageChange={handlePageClick}
                    pageCount={pageCount}
                    forcePage={currentPage}
                />
                <PageSizeSelector
                    PageSizeSelectHandler={(e) => setPageSize(Number(e.target.value))}
                    defaultValue={paginateConfig.pageSize.default}
                    items={paginateConfig.pageSize.values}
                />
              </div>
            }
        </Container>
    </Container>
  )
}

export default Validators