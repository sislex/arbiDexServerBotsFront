import { useEffect, useState } from 'react';
import { Plus, RotateCw, Trash2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectActiveBotParamsState, selectBotControlActionState } from '../store/selectors';
import { saveBotSettings } from '../store/slices/servers-slice';

const defaultJobConfig = `{
  "jobId": "job-arb-001",
  "type": "arbitrage_scanner",
  "schedule": {
    "interval": "5s",
    "enabled": true
  },
  "web3Config": {
    "provider": "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
    "chainId": 1,
    "gasLimit": 300000,
    "maxGasPrice": "100000000000",
    "contracts": {
      "router": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "factory": "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    }
  },
  "tradingParams": {
    "minProfitPercent": 0.5,
    "maxSlippage": 1.0,
    "exchanges": ["uniswap", "sushiswap", "pancakeswap"],
    "tokens": [
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    ]
  },
  "notifications": {
    "onSuccess": true,
    "onError": true,
    "webhook": "https://hooks.slack.com/services/YOUR_WEBHOOK"
  },
  "retryPolicy": {
    "maxAttempts": 3,
    "backoffMultiplier": 2,
    "initialDelay": 1000
  }
}`;

interface BotJobTabProps {
  botId: string;
}

export function BotJobTab({ botId }: BotJobTabProps) {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const botParamsState = useAppSelector(selectActiveBotParamsState);
  const botControlActionState = useAppSelector(selectBotControlActionState);
  const initialFromApi =
    JSON.stringify(botParamsState.data ?? {}, null, 2).trim() === '{}'
      ? defaultJobConfig
      : JSON.stringify(botParamsState.data, null, 2);
  const [jobConfig, setJobConfig] = useState(defaultJobConfig);

  useEffect(() => {
    if (initialFromApi !== defaultJobConfig) {
      setJobConfig(initialFromApi);
    }
  }, [initialFromApi]);

  const handleReset = () => {
    setJobConfig(initialFromApi);
  };

  return (
    <div className="p-6 h-[calc(100vh-176px)]">
      <h3 className="text-lg text-gray-900 mb-4">{t.botDetail.jobTab.title}</h3>

      <div className="flex gap-6 h-[calc(100%-48px)]">
        {/* Code Editor */}
        <div className="flex-1">
          <textarea
            value={jobConfig}
            onChange={(e) => setJobConfig(e.target.value)}
            className="w-full h-full bg-gray-900 text-gray-100 rounded-lg p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-end gap-3">
          <button
            onClick={() => dispatch(saveBotSettings({ botId, data: jobConfig }))}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={18} />
            <span>{t.botDetail.jobTab.launch}</span>
          </button>
          <button
            onClick={() => dispatch(saveBotSettings({ botId, data: jobConfig }))}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCw size={18} />
            <span>{t.botDetail.jobTab.rerun}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={18} />
            <span>{t.botDetail.jobTab.return}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <Trash2 size={18} />
            <span>{t.botDetail.jobTab.delete}</span>
          </button>
        </div>
      </div>
      {botControlActionState.error && (
        <div className="text-sm text-red-600 mt-2">{botControlActionState.error}</div>
      )}
      {botControlActionState.isLoading && (
        <div className="text-sm text-gray-500 mt-2">Saving...</div>
      )}
    </div>
  );
}
