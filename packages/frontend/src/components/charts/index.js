import { useState, useEffect, useRef, createRef } from 'react'
import * as d3 from 'd3'
import './charts.scss'
import { Container } from '@chakra-ui/react'


const LineChart = ({data, xLabel={title: '', type: 'number'}, yLabel={title: '', type: 'number'}}) => {
    const chartContainer = useRef()
    const [chartElement, setChartElement] = useState('')

    const render = () => {
        if (!chartContainer.current) return

        setChartElement('')

        let lastWidth = chartContainer.current.offsetWidth

        const setupChart = () => {
            setTimeout(() => {
                if (!chartContainer.current) return

                if (chartContainer.current.offsetWidth !== lastWidth) {
                    lastWidth = chartContainer.current.offsetWidth
                    setupChart()
                    return
                }

                setChartElement(<LineGraph
                    xLabel={xLabel}
                    yLabel={yLabel}
                    width = {chartContainer.current.offsetWidth}
                    height = {chartContainer.current.offsetHeight}
                    data={data}
                />)
            }, 100)
        }

        setupChart()
    }

    const chartObserver = new ResizeObserver(render)

    useEffect(() => {
        if (chartContainer.current && chartElement === '') 
            chartObserver.observe(chartContainer.current)
    },[chartContainer])

    return <Container 
                ref={chartContainer}
                width={'100%'} 
                height={'100%'} 
                maxW={'none'} 
                p={0} m={0}
            >
                {chartElement}
            </Container>
}

const LineGraph = ({
    data = [],
    width = 460,
    height = 180,
    xLabel = {title: '', type: 'number'},
    yLabel = {title: '', type: 'number'},
}) => {
    const [loading, setLoading] = useState(true),
            marginTop = yLabel.title ? 40 : 20,
            marginRight = 40,
            marginBottom = xLabel.title ? 45 : 20,
            marginLeft = 40
            
    const y = d3.scaleLinear(d3.extent(data, d => d.y), [height - marginBottom, marginTop])
    const [x, setX] = useState(() => {
        if (xLabel.type === 'number') return d3.scaleLinear(d3.extent(data, d => d.x), [marginLeft, width - marginRight])
        if (xLabel.type === 'date' || xLabel.type === 'time') return d3.scaleTime(d3.extent(data, d => d.x), [marginLeft, width - marginRight])
    })
    const xTickFormat = (() => {
        if (xLabel.type === 'number') return d3.format(",.0f")
        if (xLabel.type === 'date') return d3.timeFormat("%B %d")
        if (xLabel.type === 'time') return d3.timeFormat("%H:%M")
    })()
    const xTickCount = (()=> {
        if (xLabel.type === 'number') return 6
        if (xLabel.type === 'date') return 6
        if (xLabel.type === 'time') return d3.timeMinute.every(10)
    })()
    const gx = useRef()
    const gy = useRef()
    const tooltip = useRef()
    const graphicLine = useRef()
    const focusPoint = useRef()

    const [line, setLine] = useState(() => d3.line()
                                                .x(d => x(d.x))
                                                .y(d => y(d.y))
                                                .curve(d3.curveCardinal))

    const [area, setArea] = useState(() => d3.area()
                                                .curve(d3.curveCardinal)
                                                .x((d) => x(d.x))
                                                .y0(y(0))
                                                .y1((d) => y(d.y)))

    useEffect(() => void d3.select(gx.current)
                            .call((axis) => {
                                axis.select('.Axis__TickContainer')
                                    .call(d3.axisBottom(x)
                                        .tickSize(0)
                                        .tickPadding(10)
                                        .ticks(xTickCount)
                                    )
                            })
                            .call((axis) => {
                                const labelSize = axis.select('.Axis__Label').node().getBBox()

                                axis.select('.Axis__Label')
                                    .attr("transform", `translate(${width - labelSize.width/2 - marginRight}, ${marginBottom})`)
                            })
                            , [gx, x])

    useEffect(() => void d3.select(gy.current)
                            .select('.Axis__TickContainer')
                            .call(d3.axisLeft(y)
                                .tickSize(0)
                                .ticks(5)
                                .tickPadding(10)                           
                            )
                            , [gy, y])

    const updateSize = () => {
        if (!loading || !d3.select(gy.current).node()) return

        const yAxisTicksWidth = d3.select(gy.current).select('.Axis__TickContainer').node().getBBox().width

        d3.select(gy.current)
            .select('.Axis__Label')
            .attr("transform", `translate(${-yAxisTicksWidth}, ${marginTop - 15})`)

        d3.select(gy.current)
            .attr("transform", `translate(${yAxisTicksWidth}, 0)`)

        setX(() => {
            if (xLabel.type === 'number') return d3.scaleLinear(d3.extent(data, d => d.x), [yAxisTicksWidth, width - marginRight])
            if (xLabel.type === 'date' || xLabel.type === 'time') return d3.scaleTime(d3.extent(data, d => d.x), [yAxisTicksWidth, width - marginRight])
        })
        
        if (loading) setLoading(false)
    }

    useEffect(() => {
        d3.select(gx.current)
        .transition()
        .duration(0)
        .call(d3.axisBottom(x)
            .tickSize(0)
            .tickPadding(10)
            .ticks(xTickCount)
            .tickFormat(xTickFormat)
        )

        setLine((d) => d3.line()
                            .x(d => x(d.x))
                            .y(d => y(d.y))
                            .curve(d3.curveBumpX))

        setArea ((d) => d3.area()
                            .curve(d3.curveBumpX)
                            .x((d) => x(d.x))
                            .y0(y(0))
                            .y1((d) => y(d.y)))
    },[x])

    useEffect(updateSize, [])

    const bisect = d3.bisector(d => d.x).center

    function tooltipPosition(point) {
        const tooltipElement = d3.select(tooltip.current)
        const {width: tooltipWidth} = tooltipElement.node().getBoundingClientRect()

        const xPos = x(data[point].x) + tooltipWidth + 20 < width ?
                            x(data[point].x) + tooltipWidth / 2 + 15 :
                            x(data[point].x) - tooltipWidth / 2 - 15 

        tooltipElement
            .attr("transform", `translate(${xPos},${y(data[point].y)})`)
            .transition()
            .duration(0)
            .style("transition", "all .15s")
            .style("opacity", "1")
            .style("visibility", "visible")
    }
    
    function pointermoved(event) {
        const i = bisect(data, x.invert(d3.pointer(event)[0]))

        d3.select(focusPoint.current)
            .style("display", "block")
            .selectAll("circle")
            .attr("cx", x(data[i].x))
            .attr("cy", y(data[i].y))

        const path = d3.select(tooltip.current)
                        .selectAll("path")
                        .data([,])
                        .join("path")
                            .attr("fill", "#fff")
                            .attr('opacity', '.2')
                            .attr("stroke", "black")
    
        const lineClass = (type) => {
            if (type === 'blocks') return 'ChartTooltip__InfoLine--Blocks'
            return ''
        }

        const infoLines = [];
        
        infoLines.push({
            class: lineClass(), 
            value: `${yLabel.abbreviation ? yLabel.abbreviation : yLabel.title}: ${data[i].y}`
        })

        infoLines.push({
            class: lineClass(), 
            value: `${xLabel.abbreviation ? xLabel.abbreviation : xLabel.title}: ${xTickFormat(data[i].x)}`
        })

        data[i].info.map((item) => {infoLines.push({
            class: lineClass(item.type), 
            value: `${item.title}: ${item.value}`
        })})

        const text = d3.select(tooltip.current)
            .selectAll("text")
                .data([,])
                .join("text")
                .attr('class', 'ChartTooltip__TextContainer')
                .call(t => t
                    .selectAll("tspan")
                    .data(infoLines)
                    .join("tspan")
                    .attr('class', (infoLine, i) => `ChartTooltip__InfoLine ${infoLine.class}`)
                    .attr("x", 0)
                    .attr("y", (_, i) => `${i * 1.3}em`)
                    .attr('fill', '#fff')
                    .text(d => d.value))

        const {width: textW, height: textH} = text.node().getBBox()

        text.attr("transform", `translate(${-textW/2},${-(textH-20)/2 + 5})`)

        path.attr('d', `M${-textW / 2 - 10}, ${-textH/2 -10}
                    H${textW / 2 + 10}
                    v${textH + 20}
                    h-${textW + 20}
                    z`)
    
        tooltipPosition(i)
    }

    function pointerleft() {
        d3.select(tooltip.current)
            .transition()
            .delay(1)
            .style("opacity", 0)
            .style("visibility", "none")
            .style("transition", "all 0s")

        d3.select(focusPoint.current)
            .style("display", "none")
    }

    return (
        <div className={`ChartContainer ${!loading ? 'loaded' : ''}`}>
            <svg 
                onMouseEnter = {pointermoved}    
                onMouseMove = {pointermoved}    
                onMouseLeave = {pointerleft}
                overflow={'visible'}
                viewBox={`0 0 ${width} ${height}`}
            >   
                <svg x='15' y='-15' overflow={'visible'}>
                    <g className={'Axis'} ref={gx} transform={`translate(0,${height - marginBottom + 15})`} >
                        <g><text className={'Axis__Label'} fill='white'>{xLabel.title}</text></g>
                        <g className={'Axis__TickContainer'}></g>
                    </g>
                </svg>

                <svg x='0' y='-15'>
                    <g className={'Axis'} ref={gy} >  
                        <g><text className={'Axis__Label'} fill='white'>{yLabel.title}</text></g>
                        <g className={'Axis__TickContainer'}></g>
                    </g>
                </svg>
            
                <g transform={`translate(15,-15)`}>
                    <defs>
                        <linearGradient id="AreaFill" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop stopColor="#0F4D74" stopOpacity="0.3" offset="0%" />
                            <stop stopColor="#0E75B5" stopOpacity="0.3" offset="100%" />
                        </linearGradient>
                        <clipPath id="clipPath">
                            <rect 
                                x={marginLeft - 10} 
                                y={marginTop} 
                                width={width - (marginLeft - 10 + marginRight)} 
                                height={height - (marginTop + marginBottom)}
                            ></rect>
                        </clipPath>
                    </defs>

                    <path d={area(data)} fill="url(#AreaFill)" clipPath={'url(#clipPath)'}/>
                    
                    <path ref={graphicLine} d={line(data)} stroke="#0e75b5" strokeWidth="3" fill="none" />

                    <g fill='#0e75b5'>
                        {data.map((d, i) => (<circle key={i} cx={x(d.x)} cy={y(d.y)} r='4' className={'Chart__Point'} />))}
                    </g>

                    <g ref={focusPoint} className={'Chart__FocusPoint'}>
                        <circle r="2" fill='white' />
                    </g>

                    <g ref={tooltip} className={'Chart__Tooltip ChartTooltip'}></g>
                </g>
            </svg>
        </div>
    )
}

export {
    LineChart
}