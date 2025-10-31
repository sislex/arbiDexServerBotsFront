import { Component } from '@angular/core';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-title-content-layout',
  imports: [
    UpperCasePipe
  ],
  standalone: true,
  templateUrl: './title-content-layout.html',
  styleUrl: './title-content-layout.scss'
})
export class TitleContentLayout {
  dataServers = [
    {
      ip: '192.168.1.100',
      port: '8080',
      name: 'alphaServer',
      version: '1.2.3',
      status: 'active',
      timestamp: Date.now() - 1000 * 60 * 28,
      bots: [
        {
          id: 'bot-cb-001',
          name: "Coinbase Pro Scraper",
          type: "Crypto API",
          description: "REST API parser for major cryptocurrency pairs with WebSocket support for live market data",
          gate: 'Gate-A',
          maxTimeRequest: 2500,
          timeRequest: 1800,
          status: 'active',
          sendData: true,
          isStarted: true,
        },
        {
          id: 'bot-fx-001',
          name: 'Currency Analyzer',
          type: 'forex_analysis',
          description: 'Advanced currency pair analysis with machine learning',
          gate: 'Gate-B',
          maxTimeRequest: 6000,
          timeRequest: 1800,
          status: 'closed',
          sendData: false,
          isStarted: false
        },
        {
          id: 'bot-sg-001',
          name: 'Forex Signal Generator',
          type: 'signal_generation',
          description: 'Generates forex trading signals based on technical indicators',
          gate: 'Gate-A',
          maxTimeRequest: 3000,
          timeRequest: 900,
          status: 'closed',
          sendData: false,
          isStarted: false
        }
      ]
    },
    {
      ip: '192.168.1.101',
      port: '8081',
      name: 'betaServer',
      version: '1.2.4',
      status: 'active',
      timestamp: Date.now() - 1000 * 60 * 15,
      bots: [
        {
          id: 'bot-binance-001',
          name: "Binance Market Data",
          type: "Crypto API",
          description: "Real-time cryptocurrency data from Binance exchange with order book tracking",
          gate: 'Gate-C',
          maxTimeRequest: 2000,
          timeRequest: 1500,
          status: 'active',
          sendData: true,
          isStarted: true,
        },
        {
          id: 'bot-stock-001',
          name: 'Stock Market Monitor',
          type: 'equity_analysis',
          description: 'Monitors major stock indices and individual equities',
          gate: 'Gate-D',
          maxTimeRequest: 5000,
          timeRequest: 2500,
          status: 'active',
          sendData: true,
          isStarted: true
        },
        {
          id: 'bot-news-001',
          name: 'Financial News Aggregator',
          type: 'news_analysis',
          description: 'Collects and analyzes financial news for market sentiment',
          gate: 'Gate-B',
          maxTimeRequest: 4000,
          timeRequest: 1200,
          status: 'active',
          sendData: true,
          isStarted: true
        }
      ]
    },
  ]
}
