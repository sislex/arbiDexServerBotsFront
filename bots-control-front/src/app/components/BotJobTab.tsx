import { useEffect, useState } from 'react';
import { Plus, RotateCw, Trash2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectActiveBotParamsState, selectBotControlActionState } from '../store/selectors';
import { restartBot, saveBotSettings } from '../store/slices/servers-slice';

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

  const handleSave = () => dispatch(saveBotSettings({ botId, data: jobConfig }));
  const handleRerun = async () => {
    await dispatch(saveBotSettings({ botId, data: jobConfig }));
    await dispatch(restartBot(botId));
  };
  const handleDelete = () => {
    if (window.confirm(t.botDetail.jobTab.deleteConfirm)) {
      setJobConfig('');
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-122px)]">
      <h3 className="text-sm text-foreground mb-2">{t.botDetail.jobTab.title}</h3>

      <div className="flex gap-4 h-[calc(100%-28px)]">
        {/* Code Editor */}
        <div className="flex-1">
          <textarea
            value={jobConfig}
            onChange={(e) => setJobConfig(e.target.value)}
            className="w-full h-full bg-muted text-foreground border border-border rounded p-4 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-end gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            <span>{t.botDetail.jobTab.launch}</span>
          </button>
          <button
            onClick={handleRerun}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <RotateCw size={18} />
            <span>{t.botDetail.jobTab.rerun}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded hover:bg-accent transition-colors"
          >
            <RotateCcw size={18} />
            <span>{t.botDetail.jobTab.return}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Trash2 size={18} />
            <span>{t.botDetail.jobTab.delete}</span>
          </button>
        </div>
      </div>
      {botControlActionState.error && (
        <div className="text-sm text-destructive mt-2">{botControlActionState.error}</div>
      )}
      {botControlActionState.isLoading && (
        <div className="text-sm text-muted-foreground mt-2">{t.botDetail.jobTab.saving}</div>
      )}
    </div>
  );
}
