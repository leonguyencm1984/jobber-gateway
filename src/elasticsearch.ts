import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@gateway/config';
import { winstonLogger } from '@leonguyencm1984/jobber-shared';
import { Logger } from 'winston';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {

    private elasticSearchClient: Client;
    
    constructor() {
        this.elasticSearchClient = new Client(
            { node: config.ELASTIC_SEARCH_URL }
        );
    }

    public async checkConnection(): Promise<void> {
        let isConnected = false;
        while(isConnected) {
            log.info('gateway Service connecting to Elastic Search');
            try {
                const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
                log.info(`Gateway Service health status - ${health.status}`);
                isConnected = true;
            } catch (error) {
                log.error('Connection to Elastic Search failed, Retrying...');
                log.log('error', 'Gateway Service checkConenction() method error', error);
            }
        }
    }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
