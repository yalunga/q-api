import { followsResolver } from './follows/follows';
import { streamResolver } from './streams/streams';
import { viewCountsResolver } from './viewcounts/viewcounts';
import { subscriptionsResolver } from './subscriptions/subscriptions';

export default [
    followsResolver,
    streamResolver,
    viewCountsResolver,
    subscriptionsResolver
];
