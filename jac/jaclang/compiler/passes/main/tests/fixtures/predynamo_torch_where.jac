import torch;
import torch._dynamo as dynamo;

def with_breaks(a: Any, b: Any) {
    x = (a / (torch.abs(a) + 1));
    b = (b * 1.414);
    if (b.sum() < 0) {
        b = (b * -1);
    } else{
            b = (b * -2);
    }
    
    return (x * b);
}

with entry {
    a = torch.randn(4, 4, dtype=torch.float32, device='cuda');
    b = torch.randn(4, 4, dtype=torch.float32, device='cuda');
    fn_x = torch.compile(with_breaks, backend='inductor');
    explanation = dynamo.explain(fn_x)(a,b);
    print('Graph breaks:', explanation.graph_break_count);
    print('Graph count:', explanation.graph_count);
}