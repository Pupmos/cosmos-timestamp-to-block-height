import { useMemo } from "react";
import { useCallback, useEffect } from "react";
import { useState } from "react"
import { DatePicker, Input, Button, Row, Col, Checkbox, Form, Select, Statistic, TimePicker, Result, Typography, Card, PageHeader } from 'antd';
import moment from "moment";
import { CheckCircleOutlined } from '@ant-design/icons';
import { Header } from "antd/lib/layout/layout";

const { Paragraph, Text } = Typography;

const { Option } = Select;


const loadHeightFromTimestamp = async (chain: string = 'juno', timestamp: string) => {
    let { exactHeight, exactTime, err }: { exactHeight?: string, exactTime?: string, err?: string } = await fetch("https://cosmos-timestamp-to-blockheight.netlify.app/api/height", {
        "body": JSON.stringify({ chain, timestamp }),
        "method": "POST",
        headers: [
            ["Content-Type", "application/json"]
        ]
    })
        .then(r => r.json()).catch(e => ({ err: e }))

    return {
        exactHeight,
        exactTime,
        err
    }
}

// const loadHeightFromTimestamp = async (chain: string, dateStr: string) => {
//     const {
//         chain: {
//             params: {
//                 actual_block_time: secondPerBlock
//             },
//             apis: {
//                 rpc: rpcNodes
//             }
//         }
//     } = await fetch(`https://chains.cosmos.directory/${chain}`).then(r => r.json());
//     // most notional nodes are archive nodes, enabling us to go further back in history.
//     // thank you Notional ❤
//     const rpcUri = rpcNodes.find(n => n.provider?.toLowerCase().includes('notional'))?.address || `https://rpc.cosmos.directory/${chain}`;
//     console.log({ rpcUri });
//     const {
//         result: {
//             block: {
//                 header: { height: currHeight, time: currTime },
//             },
//         },
//     } = await fetch(`${rpcUri}/block`).then((r) => r.json());

//     const date = new Date(dateStr);
//     const ms = date.getTime();
//     let sampleHeight = currHeight;
//     let sampleTime = currTime;
//     let estimatedBlockHeight = sampleHeight;
//     while (true) {
//         const delta = new Date(sampleTime).getTime() - ms;
//         if (Math.abs(delta) < secondPerBlock * 1000) {
//             break;
//         }
//         const estimatedBlockDelta = Math.floor(delta / (secondPerBlock * 1000));
//         estimatedBlockHeight = sampleHeight - estimatedBlockDelta;
//         if (estimatedBlockHeight < 1) {
//             throw new Error('it is estimated that this chain did not exist at that time')
//         }
//         console.log({ estimatedBlockHeight })
//         const actualBlockTime = await fetch(
//             `${rpcUri}/block?height=${estimatedBlockHeight}`
//         )
//             .then((r) => r.json())
//             .then((r) => r.result.block.header.time);
//         console.table({ actualBlockTime, dateStr });
//         sampleTime = actualBlockTime;
//         sampleHeight = estimatedBlockHeight;
//     }
//     return {
//         exactHeight: sampleHeight,
//         exactTime: sampleTime
//     };
// };

const loadChains = async (): Promise<string[]> => {
    let chains = await fetch("https://chains.cosmos.directory")
        .then(r => r.json())
    chains = chains.chains.sort((a, b) => {
        return (b.assets?.[0]?.prices?.coingecko?.usd || 0) - (a.assets?.[0]?.prices?.coingecko?.usd || 0)
    });
    return chains;
}


const defaultMoment = moment(moment.now());

export const BlockSearchForm = () => {
    const [result, setResult] = useState<{ exactHeight?: string, exactTime?: string, err?: string } | null>(null);
    const [chains, setChains] = useState([]);
    const [error, setError] = useState('');
    const [selectedChain, setSelectedChain] = useState('juno');
    const [startDate, setStartDate] = useState(defaultMoment);
    const [isLoading, setIsLoading] = useState(false);
    const explorerLink = useMemo(() => {
        if (!chains || !result?.exactHeight) {
            return null;
        }
        const mintscanUrl = chains.find(c => c.name == selectedChain)?.explorers.find(e => e.url?.includes('mintscan.io'))?.url;
        if (!mintscanUrl) {
            return null;
        }
        return `${mintscanUrl}/blocks/${result.exactHeight}`
    }, [chains, result, selectedChain])
    const onSubmit = useCallback(() => {
        setIsLoading(true)
        loadHeightFromTimestamp(selectedChain, startDate.toDate().toISOString())
            .then(r => {
                setResult(r)
            })
            .catch(e => setError(e))
            .finally(() => {
                setIsLoading(false)
            })
    }, []);
    useEffect(() => {
        loadChains().then(chains => setChains(chains))
    }, [])

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return result ? (
        <>
            <Result
                status={result.exactHeight ? 'success' : "error"}
                title={result.exactHeight ? `Successfully Found Block Height ${result.exactHeight}!` : "Error"}
                subTitle={result.exactHeight ? `block timestamp: ${result.exactTime}` : result.err.toString() || 'Unknowm Error. Pleez tweat at @pupmos! ❤'}
                extra={[
                    <Button disabled={!!result.exactHeight} type="primary" key="console" href={explorerLink}>
                        View on Explorer
                    </Button>,
                    <Button onClick={() => setResult(null)} key="buy">Search Again</Button>,
                ]}
            >
            </Result>
        </>
    ) : (
        <>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onSubmit}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Cosmos Network"
                        name="cosmos-network"
                        rules={[{ required: true, message: 'Please select the cosmos network!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a Cosmøs Network"
                            optionFilterProp="children"
                            onChange={chain => {
                                setSelectedChain(chain)
                            }}
                            // onSearch={onSearch}
                            loading={!chains.length}
                            filterOption={(input, option) =>
                                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {
                                chains.map(c => {
                                    return <Option key={c.name} value={c.name}>{c.name.toUpperCase()}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Date / Time"
                        name="date"
                        rules={[{ required: true, message: 'Please input a valid date!' }]}
                    >
                        <DatePicker
                            showTime 
                            format="YYYY-MM-DD hh:mm:ss A"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                        />
                        {startDate.toISOString()}
                    </Form.Item>


                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={isLoading} onClick={() => {
                            onSubmit()
                        }} type="primary" htmlType="submit">
                            Find Block Height
                        </Button>
                    </Form.Item>
                </Form>
        </>
    )
}